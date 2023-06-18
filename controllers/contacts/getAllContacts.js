const Contact = require("../../models/contact");

const getAllContacts = async (req) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, ...query } = req.query;
  const skip = (page - 1) * limit;
  const data = await Contact.find({ owner, ...query }, null, { skip, limit });
  return data;
};

module.exports = getAllContacts;
