const Comment = require("../models/comment");

module.exports = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({ _id: req.comment });
    if (!comment) return res.status(400).json("Comment do not exist");
    if (
      comment.author.toString() !== req.auth.userId &&
      req.auth.role !== "Admin"
    ) {
      return res.status(401).json("You don't have permission");
    }
    next();
  } catch {
    res.status(500).json("Internal error on accesComment");
  }
};
