const UnauthorizedError = require("../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../config");
const UserService = require("../api/users/users.service");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      throw "not token";
    }
    const decoded = jwt.verify(token, config.secretJwtToken);

    const fullUser = await UserService.get(decoded.userId);

    if (!fullUser) {
      throw "User not found";
    }

    req.user = fullUser;
    next();
  } catch (message) {
    next(new UnauthorizedError(message));
  }
};
