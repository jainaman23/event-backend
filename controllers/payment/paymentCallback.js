const crypto = require("crypto");
const QRCode = require("qrcode");
const fs = require("fs");
const nodeHtmlToImage = require("node-html-to-image");
const { Member, Registration, Order, Plan } = require("@models");
const { isValidObjectId } = require("@services");
const { paymentgateway, mailer } = require("@utils");
const { PAYMENT_ORDER_STATUS, TEMPLATE } = require("@constant");

module.exports = async (req, res, next) => {
  try {
    const { event } = req.body;
    const entity = req.body?.payload?.payment?.entity;
    const orderId = req.body?.payload?.payment?.entity?.order_id;
    const signature = req.headers["x-razorpay-signature"];
    const { KEY_SECRET } = paymentgateway.getPaymentGatewayConfig();

    if (!event || !orderId) {
      throw {
        status: 400,
        message: "Invalid data payload",
      };
    }

    const expectedSignature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (expectedSignature !== signature) {
      throw {
        status: 400,
        message: "Invalid signature",
      };
    }

    const orderInfo = await getOrderInfo(orderId, event, entity);
    const userInfo = await getUserInfo(orderInfo.registrationId);

    if (event === "payment.failed") {
      await updateOrderStatus({
        orderId: orderInfo._id,
        status: PAYMENT_ORDER_STATUS.FAILED,
      });
      await updatePaymentInfoInRegistration(
        userInfo,
        PAYMENT_ORDER_STATUS.FAILED
      );
    }

    if (event === "payment.captured") {
      await updateOrderStatus({
        orderId: orderInfo._id,
        status: PAYMENT_ORDER_STATUS.PAID,
      });

      await updatePaymentInfoInRegistration(
        userInfo,
        PAYMENT_ORDER_STATUS.PAID
      );

      const { isMember } = userInfo;
      if (isMember) {
        const { name, email, countryCode, mobileNumber, batch, isMember } =
          userInfo;
        const memberExist = await isAlreadyMember({
          countryCode,
          mobileNumber,
        });
        if (!memberExist) {
          await addMember({
            name,
            email,
            countryCode,
            mobileNumber,
            batch,
          });
        }
      }
      await SendMailToUser(userInfo);
    }

    res.status(200).send({
      message: "Payment verified successfully",
      data: {
        success: true,
      },
    });
  } catch (err) {
    console.log("PAYMENT-CALLBACK-ERROR", err);
    next(err);
  }
};

const getOrderInfo = async (orderId, event, entity) => {
  const orderInfo = await Order.findOne({
    orderId: orderId,
  });
  console.log("ORDER-INFO", orderInfo);

  if (!orderInfo) {
    console.log("INVALID:orderId", orderId, event, entity);
    throw { status: 400, message: "Invalid order id" };
  }

  if (orderInfo.status === PAYMENT_ORDER_STATUS.PAID) {
    throw { status: 200, message: "Already processed" };
  }

  return orderInfo;
};

const getUserInfo = async (userId) => {
  const userInfo = await Registration.findOne({
    _id: isValidObjectId(userId, "userId"),
  });
  if (!userInfo) {
    throw { status: 400, message: "Invalid user id" };
  }
  return userInfo;
};

const updateOrderStatus = async ({ orderId, status }) => {
  const order = await Order.findOneAndUpdate(
    { _id: orderId },
    {
      $set: {
        status: status,
      },
    },
    { new: true }
  ).lean();
  return order;
};

const updatePaymentInfoInRegistration = async (userInfo, status) => {
  const info = await Registration.findOneAndUpdate(
    {
      _id: isValidObjectId(userInfo._id, "userId"),
      paymentStatus: { $ne: PAYMENT_ORDER_STATUS.PAID },
    },
    {
      $set: {
        paymentStatus: status,
      },
    },
    {
      new: true,
    }
  );
  return info;
};

const isAlreadyMember = async ({ countryCode, mobileNumber }) => {
  return await Member.find({
    countryCode,
    mobileNumber,
  });
};

const addMember = async ({ name, email, countryCode, mobileNumber, batch }) => {
  const newMember = await Member.create({
    name,
    email,
    countryCode,
    mobileNumber,
    batch,
  });
};

const SendMailToUser = async (userInfo) => {
  const { sendMail } = mailer.initialize({ channel: "mailServer" });
  const QRCodeImage = await QRCode.toDataURL(`${userInfo._id}`);
  const fileName = parseInt(Date.now()) + ".png";
  await nodeHtmlToImage({
    quality: 80,
    html: TEMPLATE.eventPass
      .replace("[IMAGE_PATH]", `'${QRCodeImage}'`)
      .replace("[USER_NAME]", userInfo.name),
    output: fileName,
    puppeteerArgs: {
      headless: true,
      args: ["--no-sandbox"],
    },
  });
  const data = fs.readFileSync(fileName, "base64");
  fs.unlinkSync(fileName);
  const htmlDataUrl = "data:image/png;base64," + data;
  const emailSentDetails = await sendMail({
    from: {
      name: "MHSOSA",
      address: "do-not-reply@mhsosa.in",
    },
    to: userInfo.email,
    subject: "MHSOSA | 2nd Alumni Meet Entry Pass",
    attachments: [
      {
        filename: "QRCode.png",
        path: htmlDataUrl,
      },
    ],
    html: TEMPLATE.eventPassMail,
  });
};
