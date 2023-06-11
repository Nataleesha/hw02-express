const Contact = require("../../models/contact");

const getAllContacts = async () => {
  const data = await Contact.find();
  return data;
};

module.exports = getAllContacts;
