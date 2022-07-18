module.exports = (req, res, next) => {
  try {
    const post = req.params.id;
    req.post = post;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
