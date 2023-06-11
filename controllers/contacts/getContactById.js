const Contact = require("../../models/contact");

const getContactById = async (id) => {
  try {
    const result = await Contact.findById(id);
    return result || null;
  } catch (error) {
    console.log(error);
  }
};

module.exports = getContactById;
