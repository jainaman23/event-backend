const QRCode = require("qrcode");
const fs = require("fs");
const nodeHtmlToImage = require("node-html-to-image");
const { Member, Registration, Plan } = require("@models");
const { mailer } = require("@utils");
const { PAYMENT_ORDER_STATUS, TEMPLATE } = require("@constant");

module.exports = async (req, res, next) => {
  const { registrationId } = req.body;

  try {
    const userInfo = await getRegisteredUserInfo(registrationId);

    console.log("userInfo", userInfo);
    await SendMailToUser(userInfo);

    return res.status(200).send({
      message: "Email sent successfully",
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getRegisteredUserInfo = async (registrationId) => {
  const user = await Registration.findOne({
    _id: registrationId,
    paymentStatus: PAYMENT_ORDER_STATUS.PAID,
  });
  if (!user) {
    throw { status: 400, message: "Invaid registration Id" };
  }
  return user;
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
  console.log("emailSentDetails", emailSentDetails);
};
