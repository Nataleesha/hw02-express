// const fs = require("fs/promises");
// const path = require("path");

// const { HttpError } = require("../helpers");
const Contact = require("../models/contact");

const listContacts = async () => {
  const data = await Contact.find();
  return data;
};

const getContactById = async (id) => {
  try {
    const result = await Contact.findById(id);
    return result || null;
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (id) => {
  try {
    const result = await Contact.findByIdAndRemove(id);
    return result || null;
  } catch (error) {
    console.log(error);
  }
};

const addContact = async ({ name, email, phone, favorite }) => {
  const newContact = {
    name,
    email,
    phone,
    favorite,
  };
  await Contact.create(newContact);
  return newContact;
};

const updateContact = async (id, body) => {
  try {
    const result = await Contact.findByIdAndUpdate(id, body, { new: true });
    return result || null;
  } catch (error) {
    console.log(error);
  }
};

const updateStatusContact = async (id, body) => {
  try {
    const result = await Contact.findByIdAndUpdate(id, body, { new: true });
    return result || null;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
