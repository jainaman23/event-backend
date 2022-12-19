const nodeMailer = require("nodemailer");
const config = require("@config");

let transporter = nodeMailer.createTransport({
  host: config.EMAIL_SERVER.host,
  secure: config.EMAIL_SERVER.port,
  port: 465,
  auth: {
    user: config.EMAIL_SERVER.username,
    pass: config.EMAIL_SERVER.password,
  },
});

const send = async (mailOptions) => {
  try {
    return await transporter.sendMail(mailOptions);
  } catch (err) {
    throw err;
  }
};

module.exports = { send };
