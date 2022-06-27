const Post = require("../models/post");

module.exports = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.post });
    if (!post) return res.status(400).json("Post do not exist");
    if (
      post.author.toString() !== req.auth.userId &&
      req.auth.role !== "Admin"
    ) {
      return res.status(401).json("You don't have permission");
    }
    next();
  } catch {
    res.status(500).json("Internal error on accesPost");
  }
};
