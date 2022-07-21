const Comment = require("../models/comment");
const Post = require("../models/post");

exports.create = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const comment = new Comment({
      text: req.body.text,
      post: req.params.id,
      author: userId,
      likes: [],
    });
    await comment.save();
    const post = await Post.findById(comment.post);
    post.comments.push(comment._id);
    await post.update(post);
    await comment.populate({ path: "author", select: "userName imageUrl" });
    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    comment.text = req.body.text;
    await Comment.updateOne(
      { _id: req.params.id },
      {
        _id: comment._id,
        text: comment.text,
        post: comment.post,
        author: comment.author,
        likes: comment.likes,
      }
    );
    return res.status(201).json(comment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    await Comment.deleteOne({ _id: req.params.id });
    return res.status(200).json({ _id: req.params.id, post: comment.post });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.like = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const comment = await Comment.findOne({ _id: req.params.id });
    if (!comment.likes.includes(userId)) {
      comment.likes = [...comment.likes, userId];
      await Comment.updateOne(
        { _id: req.params.id },
        {
          _id: comment._id,
          text: comment.text,
          author: comment.author,
          likes: comment.likes,
        }
      );
      await comment.populate({ path: "author", select: "userName imageUrl" });
    }
    return res.status(200).json(comment);
  } catch {
    return res.status(500).json({ error: "Failed to like comment" });
  }
};

exports.unlike = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const comment = await Comment.findOne({ _id: req.params.id });
    if (comment.likes.includes(userId)) {
      const newLikes = comment.likes.filter((id) => id != userId);
      comment.likes = newLikes;
      await Comment.updateOne(
        { _id: comment._id },
        {
          _id: comment._id,
          text: comment.text,
          author: comment.author,
          likes: comment.likes,
        }
      );
      await comment.populate({ path: "author", select: "userName imageUrl" });
    }
    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
