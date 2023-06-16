const express = require("express");

const bcryptjs = require("bcryptjs");
const User = require("../../models/user");

const usersControl = require("../../controllers/users");
const { userRegisterSchema } = require("../../schemas/joi-users");
const { HttpError } = require("../../helpers");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { error } = userRegisterSchema.validate(req.body);
    if (error) {
      throw HttpError(400, "Bad Request");
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email is already in use");
    }

    const hashPassword = await bcryptjs.hash(password, 10);
    const newUser = await usersControl.register({
      ...req.body,
      password: hashPassword,
    });
    res.status(201).json({
      email: newUser.email,
      subscription: newUser.subscription,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("🚀 ~ file: auth.js:43 ~ router.post ~ user:", user);
    if (!user) {
      throw HttpError(401, "Wrong email");
    }
    const passwordCheck = await bcryptjs.compare(password, user.password);
    if (!passwordCheck) {
      throw HttpError(401, "Wrong password");
    }
    const token = "iefnggklr485t";
    res.json(token);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
