/* eslint-disable func-names */
const mail = require('nodemailer');

const transporter = mail.createTransport(process.env.SMTP);

const sendEmail = function (emailTo, subject, html, callback) {
  const mailOptions = {
    from: '"Linkino" <service@linkino.me>',
    to: emailTo,
    subject,
    html,
  };
  // send mail with defined transport object
  transporter.sendMail(mailOptions, callback);
};
module.exports = {
  sendEmail,
};
