const getAllContacts = require("../contacts/getAllContacts");

const getContactById = require("../contacts/getContactById");

const removeContact = require("../contacts/removeContact");

const addContact = require("../contacts/addContact");

const updateContact = require("../contacts/updateContact");

const updateStatusContact = require("../contacts/updateStatusContact");

module.exports = {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
