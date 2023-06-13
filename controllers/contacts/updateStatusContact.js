const Contact = require("../../models");

const updateStatusContact = async (id, body) => {
  try {
    const result = await Contact.findByIdAndUpdate(id, body, { new: true });
    return result || null;
  } catch (error) {
    console.log(error);
  }
};

module.exports = updateStatusContact;
