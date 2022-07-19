const User = require("../models/comment");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.auth.userId });
    if (!user) return res.status(400).json({ error: "Not found" });
    if (user._id.toString() !== req.auth.userId && req.auth.role !== "Admin") {
      return res.status(403).json({ error: "Forbidden action" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
