const { BASE_URL } = process.env;
const sendEmail = require("./sendEmail");

const sendVerificationEmail = async (user) => {
  await sendEmail(
    user.email,
    "v.paritskiy@code-on.be",
    "Verify email",
    `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`
  );
};

module.exports = sendVerificationEmail;
