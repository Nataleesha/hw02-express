const Joi = require("joi");

const userRegisterSchema = Joi.object({
  // name: Joi.string().required().messages({
  //   "string.base": `"name" should be a type of 'text'`,
  //   "string.empty": `"name" cannot be an empty field`,
  //   "any.required": `"name" is a required field`,
  // }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .messages({
      "string.empty": `"email" cannot be an empty field`,
      "any.required": `"email" is a required field`,
    })
    .required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  userRegisterSchema,
};
