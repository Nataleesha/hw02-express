const Joi = require("joi");

const userRegisterSchema = Joi.object({
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

const userEmailVerifySchema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

module.exports = {
  userRegisterSchema,
  userEmailVerifySchema,
};
