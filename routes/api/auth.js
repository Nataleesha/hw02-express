const fs = require("fs/promises");
const path = require("path");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("../../models/user");
const gravatar = require("gravatar");
const Jimp = require("jimp");

const { userRegisterSchema } = require("../../schemas/joi-users");
const { HttpError } = require("../../helpers");
const { TOKEN } = process.env;
const { authenticate, upload } = require("../../middlewares");
const avatarsDir = path.resolve("public", "avatars");

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
    const avatar = gravatar.url(email, {
      protocol: "https",
      s: "100",
      r: "x",
      d: "retro",
    });
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL: avatar,
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
    if (!result) {
      throw HttpError(400, "Wrong sub");
    }
    res.json({ email: result.email, subscription: result.subscription });
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      console.log(req.file);
      const id = req.user._id;
      const { path: oldPath, filename } = req.file;
      const newPath = path.join(avatarsDir, filename);
      const image = await Jimp.read(oldPath);
      image.resize(250, 250).write(newPath);
      fs.rename(oldPath, newPath);
      const avatar = path.join("avatars", filename);
      const result = await User.findByIdAndUpdate(
        id,
        { avatarURL: avatar },
        { new: true }
      );
      if (!result) {
        throw HttpError(400);
      }
      res.json({ avatarURL: result.avatarURL });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
