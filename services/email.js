const sgMail = require("@sendgrid/mail");

const sendEmail = async (to, from, subject, html) => {
  const msg = {
    to,
    from,
    subject,
    html,
  };

  await sgMail.send(msg);
};

module.exports = sendEmail;
