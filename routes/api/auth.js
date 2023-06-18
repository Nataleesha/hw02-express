const express = require("express");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("../../models/user");

const usersControl = require("../../controllers/users");
const { userRegisterSchema } = require("../../schemas/joi-users");
const { HttpError } = require("../../helpers");
const { TOKEN } = process.env;
const { authenticate } = require("../../middlewares");

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
    if (!user) {
      throw HttpError(401, "Wrong email");
    }
    const passwordCheck = await bcryptjs.compare(password, user.password);
    if (!passwordCheck) {
      throw HttpError(401, "Wrong password");
    }

    const { _id: id } = user;

    const payload = {
      id,
    };
    const token = jwt.sign(payload, TOKEN, { expiresIn: "23h" });
    await User.findByIdAndUpdate(id, { token });
    res.json({
      token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/logout", authenticate, async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({ message: "Logged out" });
});

router.get("/current", authenticate, async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
});

router.patch("/", authenticate, async (req, res, next) => {
  try {
    const id = req.user._id;
    const result = await User.findByIdAndUpdate(id, req.body, { new: true });
    console.log("🚀 ~ file: auth.js:85 ~ router.patch ~ result:", result);
    if (!result) {
      throw HttpError(400, "Wrong sub");
    }
    res.json({ email: result.email, subscription: result.subscription });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
