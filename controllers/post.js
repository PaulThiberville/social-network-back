const Comment = require("../models/comment");
const Post = require("../models/post");

exports.create = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const post = new Post({
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      author: userId,
      comments: [],
      likes: [],
    });
    await post.save();
    await post.populate({ path: "author", select: "userName imageUrl" });
    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.readAll = async (req, res) => {
  try {
    Post.find({})
      .populate([
        { path: "author", select: "userName imageUrl" },
        {
          path: "comments",
          select: "text author likes",
          populate: {
            path: "author",
            select: "userName imageUrl",
          },
        },
      ])
      .exec(function (error, docs) {
        return res.status(200).json(docs);
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.readAllByUser = async (req, res) => {
  try {
    Post.find({ author: req.params.id })
      .populate([
        { path: "author", select: "userName imageUrl" },
        {
          path: "comments",
          select: "text author likes",
          populate: {
            path: "author",
            select: "userName imageUrl",
          },
        },
      ])
      .exec(function (error, docs) {
        return res.status(200).json(docs);
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.readOne = async (req, res) => {
  try {
    Post.findOne({ _id: req.params.id })
      .populate([
        { path: "author", select: "userName imageUrl" },
        {
          path: "comments",
          select: "text author likes",
          populate: {
            path: "author",
            select: "userName imageUrl",
          },
        },
      ])
      .exec(function (error, docs) {
        return res.status(200).json(docs);
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) return res.status(404).json({ error: "Post not found" });
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
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await Comment.deleteMany({ post: req.params.id });
    await Post.deleteOne({ _id: req.params.id });
    return res.status(200).json({ _id: req.params.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
      await post.populate({ path: "author", select: "userName imageUrl" });
    }
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
      await post.populate({ path: "author", select: "userName imageUrl" });
    }
    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
