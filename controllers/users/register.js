const User = require("../../models/user");

const register = async (req) => {
  const newUser = await User.create(req);
  return newUser;
};

module.exports = register;
