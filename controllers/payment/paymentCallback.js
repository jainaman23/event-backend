const crypto = require("crypto");
const QRCode = require("qrcode");
const { Member, Registration, Order, Plan } = require("@models");
const { isValidObjectId } = require("@services");
const { paymentgateway, mailer } = require("@utils");
const { PAYMENT_ORDER_STATUS } = require("@constant");

module.exports = async (req, res, next) => {
  try {
    const { event } = req.body;
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

    const orderInfo = await getOrderInfo(orderId);
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
        await addMember({
          name,
          email,
          countryCode,
          mobileNumber,
          batch,
        });
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

const getOrderInfo = async (orderId, companyId) => {
  const orderInfo = await Order.findOne({
    orderId: orderId,
    status: PAYMENT_ORDER_STATUS.CREATED,
  });
  if (!orderInfo) {
    throw { status: 400, message: "Invalid order id" };
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
    { _id: isValidObjectId(userInfo._id, "companyId") },
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
  const QRCodeImage = await QRCode.toDataURL(`regisrationId:${userInfo}`);
  const emailSentDetails = await sendMail({
    from: "info@lataservices.com",
    to: userInfo.email,
    subject: "Entry Entry Pass | Alumini Meet",
    attachments: [
      {
        filename: "QRCode.png",
        path: QRCodeImage,
      },
      {
        filename: "QRCode.png",
        path: QRCodeImage,
        cid: "QRCode",
      },
    ],
    html: `<b>thank you for registering with us. We look forward to seeing you in the evenet</b></br>
        Note: Please do not share this QR Code with anyone, This is valid only for single entry.</br>
        Thank you</br>
       <img src = 'cid:QRCode'></img>`,
  });
  console.log("emailSentDetails", emailSentDetails);
};
