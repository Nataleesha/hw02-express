const Contact = require("../../models");

const getAllContacts = async () => {
  const data = await Contact.find();
  return data;
};

module.exports = getAllContacts;
