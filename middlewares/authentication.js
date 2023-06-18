const jwt = require("jsonwebtoken");

const { HttpError } = require("../helpers");
const { TOKEN } = process.env;
const User = require("../models/user");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (!token || bearer !== "Bearer") {
    next(HttpError(401));
  }
  try {
    const { id } = jwt.verify(token, TOKEN);
    const user = await User.findById(id);
    if (!user || !user.token) {
      next(HttpError(401));
    }
    req.user = user;
    next();
  } catch {
    next(HttpError(401));
  }
};

module.exports = authenticate;
