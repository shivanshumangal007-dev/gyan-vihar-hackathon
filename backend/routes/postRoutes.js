const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// GET all posts
router.get("/", async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// CREATE post
router.post("/", async (req, res) => {
  const post = await Post.create(req.body);
  res.status(201).json(post);
});

// DELETE post
router.delete("/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted" });
});

// UPVOTE
router.patch("/:id/upvote", async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.upvotes++;
  await post.save();
  res.json(post);
});

module.exports = router;
