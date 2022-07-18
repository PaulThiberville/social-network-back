module.exports = (req, res, next) => {
  try {
    const comment = req.params.id;
    req.comment = comment;
    next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
