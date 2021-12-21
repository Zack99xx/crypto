var express = require("express");
const axios = require("axios");
var router = express.Router();
const cc = require("cryptocompare");
var env = require("../config/index.js");
var AuthMiddleware = require("../middleware/auth.js");

const APIKEY = env.cryptoAPIkey;
cc.setApiKey(APIKEY);

var Rss = require("../models/rssFeed.js");
var User = require("../models/user.js");

// get all rss feeds available on the platform
router.get("/", async function (req, res) {
  let list = await Rss.find();

  return res.status(200).json({
    status: 200,
    message: "Rss feeds list retrieved.",
    data: list,
  });
});

// get all existant rss feeds
router.get("/all", async function (req, res) {
  let url = `https://min-api.cryptocompare.com/data/news/feeds?api_key=${APIKEY}`;

  let response = await axios.get(url);

  return res.status(200).json({
    status: 200,
    message: "Rss feeds retrieved.",
    data: response.data,
  });
});

// add rss feed to platform
router.post("/", AuthMiddleware, async function (req, res) {
  let user = await User.find({ _id: req.user.id }, {}, { upsert: true }).exec();

  if (user && user[0] && user[0].role !== "admin") {
    return res.status(400).json({
      status: 400,
      message: "Only admin can remove a crypto to the platform.",
    });
  }

  if (!req.body) {
    return res.status(400).json({
      status: 400,
      message: "Request error",
    });
  } else if (!req.body.key) {
    return res.status(400).json({
      status: 400,
      message: "Missing feed key.",
    });
  } else if (!req.body.image_url) {
    return res.status(400).json({
      status: 400,
      message: "Missing feed image url.",
    });
  }

  const feed = new Rss({
    key: req.body.key,
    image_url: req.body.image_url,
  });

  await feed.save(function (err) {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: err.errors.key
          ? "This feed is already present on the platform."
          : err.errors.image_url
          ? "This feed image url is already present on the platform."
          : "An error occured",
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "Feed added",
      });
    }
  });
});

// delete rss feed from platform
router.delete("/:key", AuthMiddleware, async function (req, res) {
  let user = await User.find({ _id: req.user.id }, {}, { upsert: true }).exec();

  if (user && user[0] && user[0].role !== "admin") {
    return res.status(400).json({
      status: 400,
      message: "Only admin can remove a crypto to the platform.",
    });
  }

  var query = { key: req.params.key };

  Rss.deleteOne(query, function (err, doc) {
    if ((err && err.name === "CastError") || (doc && doc.deletedCount < 1)) {
      return res.status(400).json({
        status: 400,
        message: "Rss feed does not exists.",
      });
    } else if (err) {
      return res.status(400).json({
        status: 400,
        message: err.message,
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Succesfully deleted.",
    });
  });
});

module.exports = router;
