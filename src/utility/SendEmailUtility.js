const nodemailer = require("nodemailer");

const SendEmailUtility = async (emailTo, emailText, emailSubject) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "ronytalukder.cit.bd@gmail.com",
      pass: "qkqg jshm sruy zuji",
    },
  });

  let mailOptions = {
    from: "Todo Planner <ronytalukder.cit.bd@gmail.com>",
    to: emailTo,
    subject: emailSubject,
    text: emailText,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = SendEmailUtility;



