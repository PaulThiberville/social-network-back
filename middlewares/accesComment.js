const Comment = require("../models/comment");

module.exports = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({ _id: req.comment });
    if (!comment) return res.status(400).json({ error: "Not found" });
    if (
      comment.author.toString() !== req.auth.userId &&
      req.auth.role !== "Admin"
    ) {
      return res.status(403).json({ error: "Forbidden action" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
