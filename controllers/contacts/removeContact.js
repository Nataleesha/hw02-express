const Contact = require("../../models/contact");

const removeContact = async (id) => {
  try {
    const result = await Contact.findByIdAndRemove(id);
    return result || null;
  } catch (error) {
    console.log(error);
  }
};

module.exports = removeContact;
