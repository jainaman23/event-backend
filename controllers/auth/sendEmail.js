const QRCode = require("qrcode");
const { Member, Registration, Plan } = require("@models");
const { mailer } = require("@utils");
const { PAYMENT_ORDER_STATUS } = require("@constant");

module.exports = async (req, res, next) => {
  const { registrationId } = req.body;

  try {
    const userInfo = await getRegisteredUserInfo(registrationId);

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
  const QRCodeImage = await QRCode.toDataURL(userInfo._id);
  const emailSentDetails = await sendMail({
    from: "info@lataservices.com",
    to: userInfo.email,
    subject: "Entry Pass | Alumini Meet",
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
    html: `<b>Thank you for registering with us. We look forward to seeing you in the event</b><br/>
          Note: Please do not share this QR Code with anyone, This is valid only for single entry.<br/>
          Thank you</br>
         <img src = 'cid:QRCode'></img>`,
  });
  console.log("emailSentDetails", emailSentDetails);
};
