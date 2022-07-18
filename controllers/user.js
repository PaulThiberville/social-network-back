const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const post = require("../models/post");

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
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found");
    if (await bcrypt.compare(req.body.password, user.password)) {
      return res.status(200).json({
        userId: user._id,
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

exports.GetOne = async (req, res) => {
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

//TODO: delete user, related posts end related comments
