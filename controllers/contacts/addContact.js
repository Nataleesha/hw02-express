const Contact = require("../../models/contact");

const addContact = async (user, { name, email, phone, favorite }) => {
  const { _id: owner } = user;
  const newContact = {
    name,
    email,
    phone,
    favorite,
  };
  await Contact.create({ ...newContact, owner });
  return newContact;
};

module.exports = addContact;
