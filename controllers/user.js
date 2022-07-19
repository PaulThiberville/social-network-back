const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash,
      userName: req.body.userName,
      imageUrl: "default",
      bio: "Hey !",
      role: "Basic",
      friends: [],
    });
    await user.save();
    return res.status(201).json("User succesfully created !");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  console.log("Login : ", req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found");
    if (await bcrypt.compare(req.body.password, user.password)) {
      return res.status(200).json({
        id: user._id,
        token: jwt.sign(
          { userId: user._id, role: user.role },
          process.env.TOKEN_SECRET,
          {
            expiresIn: "24h",
          }
        ),
      });
    }
    return res.status(400).json("Invalid Password");
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(404).json("User not found");
    return res.status(200).json({
      _id: user._id,
      userName: user.userName,
      imageUrl: user.imageUrl,
      bio: user.bio,
      friends: user.friends,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(404).json("User not found");
    user.userName = req.body.userName;
    user.bio = req.body.bio;
    user.imageUrl = req.body.imageUrl;
    await User.updateOne({ _id: user._id }, user);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(404).json("User not found");
    await Comment.deleteMany({ author: req.params.id });
    await Post.deleteMany({ author: req.params.id });
    await User.deleteOne({ _id: req.params.id });
    return res.status(200).json({ _id: req.params.id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
