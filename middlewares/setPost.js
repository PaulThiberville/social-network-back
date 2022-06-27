module.exports = (req, res, next) => {
  try {
    const post = req.params.id;
    if (!post) return res.status(400).json("No postId in request body");
    req.post = post;
    next();
  } catch {
    res.status(500).json("Internal error on setPost");
  }
};
