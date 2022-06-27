const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  text: { type: String, required: true },
  imageUrl: { type: String, required: true },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
});

module.exports = mongoose.model("Post", postSchema);
