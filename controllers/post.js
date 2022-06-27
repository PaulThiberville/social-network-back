const Post = require("../models/post");

exports.create = async (req, res) => {
  try {
    const post = new Post({
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      author: req.body.userId,
    });
    await post.save();
    return res.status(201).json(post);
  } catch {
    return res.status(500).json("Failed to create post");
  }
};

exports.readAll = async (req, res) => {
  try {
    Post.find({})
      .populate("author")
      .exec(function (error, docs) {
        return res.status(200).json(docs);
      });
  } catch {
    return res.status(500).json("Failed to load posts");
  }
};

exports.readOne = async (req, res) => {
  try {
    Post.findOne({ _id: req.params.id })
      .populate("author")
      .exec(function (error, docs) {
        return res.status(200).json(docs);
      });
  } catch {
    return res.status(500).json("Failed to load post");
  }
};

exports.update = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) return res.status(404).json("Post not found");
    post.text = req.body.text;
    post.imageUrl = req.body.imageUrl;
    await Post.updateOne(
      { _id: req.params.id },
      {
        _id: post._id,
        text: post.text,
        imageUrl: post.imageUrl,
        author: post.author,
      }
    );
    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json("Failed to update post");
  }
};

exports.delete = async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    //TODO: delete all related comments
    return res.status(200).json("Post deleted");
  } catch (error) {
    return res.status(500).json("Failed to delete post");
  }
};
