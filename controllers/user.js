const User = require("../models/user");
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
  } catch {
    return res.status(500).json("Failed to register user");
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
  } catch {
    res.status(500);
  }
};

//TODO: delete user, related posts end related comments
