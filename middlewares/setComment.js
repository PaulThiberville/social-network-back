module.exports = (req, res, next) => {
  try {
    const comment = req.params.id;
    if (!comment) return res.status(400).json("No commentId in request body");
    req.comment = comment;
    next();
  } catch {
    res.status(500).json("Internal error on setComment");
  }
};
