const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const tokenSecret = process.env.TOKEN_SECRET;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, tokenSecret);
    const userId = decodedToken.userId;
    const role = decodedToken.role;
    req.auth = { userId, role };
    next();
  } catch {
    res.status(401).json("You are not Authenticated");
  }
};
