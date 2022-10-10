const router = require("express").Router();
const sequelize = require("../config/connection");
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", (req, res) => {
  Post.findAll({
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],
      //[sequelize.literal('(SELECT COUNT (*) FROM downvote WHERE post.id=downvote.post_id)'), 'downvote_count]?
      //pull image/file; cloudinary
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id", "user_id", "created_at"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attribtues: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      const posts = dbPostData.map((post) => post.get({ plain: true }));
      console.log(dbPostData[0]);
      res.render("homepage", {
        posts,
        loggedIn: req.session.loggedIn,
        homePage: true,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }

  res.render("login", { login: true });
});

router.get("/signup", (req, res) => {
  res.render("signup", { login: true });
});

router.get("/upload", withAuth, (req, res) => {
  res.render("upload", { loggedIn:req.session.loggedIn, upload: true });
});

router.get("/post/:id", (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id,
    },
    attributes: [
      "id",
      "post_url",
      "title",
      "created_at",
      [
        sequelize.literal(
          "(SELECT COUNT (*) FROM vote WHERE post.id = vote.post_id)"
        ),
        "vote_count",
      ],
    ],
    include: [
      {
        model: Comment,
        attributes: ["id", "comment_text", "post_id"],
        include: {
          model: User,
          attributes: ["username"],
        },
      },
      {
        model: User,
        attributes: ["username"],
      },
    ],
  })
    .then((dbPostData) => {
      if (!dbPostData) {
        res.status(404).json({ message: "No post found with this id" });
        return;
      }

      //serialize the data
      const post = dbPostData.get({ plain: true });

      //pass data to template
      res.render("single-post", {
        post,
        loggedIn: req.session.loggedIn,
        singlePage: true,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
