const { send } = require("./server");

function methods({ channel }) {
  const sendMail = ({ from, to, subject, html, attachments, text }) => {
    const mailOptions = {
      from: from,
      to: to,
      subject: subject,
      attachments: attachments,
      html: html,
      text: text,
    };

    if (channel === "mailServer") {
      return send(mailOptions);
    }
  };
  return { sendMail };
}

module.exports = methods;
