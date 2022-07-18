const Post = require("../models/post");

module.exports = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.post });
    if (!post) return res.status(400).json({ error: "Not found" });
    if (
      post.author.toString() !== req.auth.userId &&
      req.auth.role !== "Admin"
    ) {
      return res.status(403).json({ error: "Forbidden action" });
    }
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
