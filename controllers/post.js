const Post = require("../models/post");

exports.create = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const post = new Post({
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      author: userId,
      likes: [],
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
      .populate({ path: "author", select: "userName imageUrl" })
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
      .populate({ path: "author", select: "userName imageUrl" })
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
        likes: post.likes,
      }
    );
    return res.status(201).json(post);
  } catch {
    return res.status(500).json("Failed to update post");
  }
};

exports.delete = async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    //TODO: delete all related comments
    return res.status(200).json("Post deleted");
  } catch {
    return res.status(500).json("Failed to delete post");
  }
};

exports.like = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const post = await Post.findOne({ _id: req.params.id });
    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      await Post.updateOne(
        { _id: post._id },
        {
          _id: post._id,
          text: post.text,
          imageUrl: post.imageUrl,
          author: post.author,
          likes: post.likes,
        }
      );
    }
    return res.status(200).json(post);
  } catch {
    return res.status(500).json("Failed to like post");
  }
};

exports.unlike = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const post = await Post.findOne({ _id: req.params.id });
    if (post.likes.includes(userId)) {
      const newLikes = post.likes.filter((id) => id != userId);
      post.likes = newLikes;
      await Post.updateOne(
        { _id: post._id },
        {
          _id: post._id,
          text: post.text,
          imageUrl: post.imageUrl,
          author: post.author,
          likes: post.likes,
        }
      );
    }
    return res.status(200).json(post);
  } catch {
    return res.status(500).json("Failed to unlike post");
  }
};
