const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: { type: String, default: "Anonymous" },
    title: String,
    description: String,
    tag: String,
    upvotes: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);
