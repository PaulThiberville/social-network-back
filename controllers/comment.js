const Comment = require("../models/comment");

exports.create = async (req, res) => {
  try {
    const comment = new Comment({
      text: req.body.text,
      post: req.body.postId,
      author: req.body.userId,
    });
    await comment.save();
    return res.status(201).json(comment);
  } catch {
    return res.status(500).json("Failed to create comment");
  }
};

exports.readAll = async (req, res) => {
  try {
    Comment.find({ post: req.params.id })
      .populate("author")
      .exec(function (error, docs) {
        return res.status(200).json(docs);
      });
  } catch {
    return res.status(500).json("Failed to load comments");
  }
};

exports.readOne = async (req, res) => {
  try {
    Comment.findOne({ _id: req.params.id })
      .populate("author")
      .exec(function (error, docs) {
        return res.status(200).json(docs);
      });
  } catch {
    return res.status(500).json("Failed to load comment");
  }
};

exports.update = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    if (!comment) return res.status(404).json("Comment not found");
    comment.text = req.body.text;
    await Comment.updateOne(
      { _id: req.params.id },
      {
        _id: comment._id,
        text: comment.text,
        post: comment.post,
        author: comment.author,
      }
    );
    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json("Failed to update comment");
  }
};

exports.delete = async (req, res) => {
  try {
    await Comment.deleteOne({ _id: req.params.id });
    return res.status(200).json("Comment deleted");
  } catch (error) {
    return res.status(500).json("Failed to delete comment");
  }
};
