const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Post = require("./models/post");
const app = express();
mongoose
  .connect(
    "mongodb+srv://.mongodb.net/"
  )
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("connected failed");
  });
app.use(bodyParser.json());
// app.use((req, res, next) => {
//   console.log("first middle ware");
//   next();
// });
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With,Content-Type,Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS"
  );
  next();
});
app.delete("/api/post/delete/:id", (req, res, next) => {
  //console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then((msg) => {
    console.log(msg);
    res.status(200).json({ message: "post deleted successfully" });
  });
});

app.post("/api/post", (req, res, next) => {
  // const post = req.body;
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  console.log(post);
  post.save().then((result) => {
    res.status(201).json({ message: "added successfully", postId: result._id });
  });
});
app.use("/api/posts", (req, res, next) => {
  //   const posts = [
  //     {
  //       id: "1",
  //       title: "First post",
  //       content: "coming from backend",
  //     },
  //     { id: "2", title: "Second post", content: "coming from backend" },
  //   ];
  Post.find().then((document) => {
    console.log(document);
    res.status(200).json({
      message: "Fetch Successfully",
      post: document,
    });
  });
  //   res.send(posts);
});

module.exports = app;
