var express = require("express");
var router = express.Router();
const axios = require("axios");
var AuthMiddleware = require("../middleware/auth.js");
const cc = require("cryptocompare");
var cryptos = require("../cryptos/cryptos.json");
var env = require("../config/index.js");

const APIKEY = env.cryptoAPIkey;
cc.setApiKey(APIKEY);

var Crypto = require("../models/crypto.js");
const User = require("../models/user.js");

// gets multi cryptos infos (default currency is EUR)
router.get("/", async function (req, res) {
  if (!req.body) {
    return res.status(400).json({
      status: 400,
      message: "Request error",
    });
  } else if (!req.query.cmids) {
    return res.status(400).json({
      status: 400,
      message: "No id(s) specified.",
    });
  } else if (!Array.isArray(req.query.cmids)) {
    return res.status(400).json({
      status: 400,
      message: "Parameter 'cmids' needs to be an array of string.",
    });
  }

  let data;
  for (cm of req.query.cmids) {
    data = await Crypto.find({ id: cm }, {}, { upsert: true }).exec();
    if (data.length < 1) {
      return res.status(400).json({
        status: 400,
        message: `One or more cryptos are not available on the platform.`,
      });
    }
  }

  let coinIds = req.query.cmids;
  let coins = [];

  coinIds.forEach((id) => {
    let coinKey = Object.keys(cryptos).find((key) => key === id);
    if (!cryptos[coinKey]) {
      return res.status(400).json({
        status: 400,
        message: `One or more cryptos doesn't exist.`,
      });
    }
    coins[coinKey] = cryptos[coinKey];
  });

  let cryptoList = req.query.cmids.join(",");
  let currencyList = "";

  if (req.query.crids) {
    if (!Array.isArray(req.query.crids)) {
      return res.status(400).json({
        status: 400,
        message: "Parameter 'crids' needs to be an array of string.",
      });
    }
    currencyList = req.query.crids.join(",");
  } else {
    currencyList = "EUR";
  }

  let cryptoUrl = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoList}&tsyms=${currencyList}&api_key=${APIKEY}`;

  axios({
    method: "get",
    url: cryptoUrl,
  }).then((response) => {
    let data = response.data.RAW;
    Object.keys(data).map(function (key, index) {
      data[key].FullName = coins[key].FullName;
    });
    return res.status(200).json({
      status: 200,
      message: "Cryptos retrieved.",
      data: data,
    });
  });
});

// gets one crypto info (default currency is EUR)
router.get("/:id", AuthMiddleware, async function (req, res) {
  let cmid = req.params.id;

  if (!cryptos[cmid]) {
    return res.status(400).json({
      status: 400,
      message: `${cmid} does not exist.`,
    });
  }

  let cryptoName = cryptos[cmid].FullName;

  let data = await Crypto.find({ id: cmid }, {}, { upsert: true }).exec();
  if (data.length < 1) {
    return res.status(400).json({
      status: 400,
      message: `${cmid} is not available on the platform.`,
    });
  }

  let currencyList = "";

  if (req.body && req.body.crids) {
    if (!Array.isArray(req.body.crids)) {
      return res.status(400).json({
        status: 400,
        message: "Parameter 'crids' needs to be an array of string.",
      });
    }
    currencyList = req.body.crids.join(",");
  } else {
    currencyList = "EUR";
  }

  let cryptoUrl = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cmid}&tsyms=${currencyList}&api_key=${APIKEY}`;

  axios({
    method: "get",
    url: cryptoUrl,
  }).then((response) => {
    let data = response.data.RAW;
    Object.keys(data).map(function (key, index) {
      data[key].FullName = cryptoName;
    });
    return res.status(200).json({
      status: 200,
      message: "Crypto retrieved.",
      data: data,
    });
  });
});

// gets list of cryptos available on the platform
router.get("/list/all", async function (req, res) {
  let list = await Crypto.find();

  return res.status(200).json({
    status: 200,
    message: "Crypto's list retrieved.",
    data: list,
  });
});

// gets one crypto history info (default currency is EUR)
router.get("/:id/history/:period", AuthMiddleware, async function (req, res) {
  let cmid = req.params.id;

  if (!cryptos[cmid]) {
    return res.status(400).json({
      status: 400,
      message: `${cmid} does not exist.`,
    });
  }

  let period = req.params.period;

  let data = await Crypto.find({ id: cmid }, {}, { upsert: true }).exec();
  if (data.length < 1) {
    return res.status(400).json({
      status: 400,
      message: `${cmid} is not available on the platform.`,
    });
  }

  let currency = "";

  if (req.body && req.body.crids) {
    if (Array.isArray(req.body.crids)) {
      return res.status(400).json({
        status: 400,
        message: "Parameter 'crids' needs to be a string.",
      });
    }
    currency = req.body.crids;
  } else {
    currency = "EUR";
  }

  let cryptoUrl;

  if (period === "minute")
    cryptoUrl = `https://min-api.cryptocompare.com/data/v2/histominute?api_key=${APIKEY}&fsym=${cmid}&tsym=${currency}&limit=120`;
  // last 2 hours (so 120 period of 1 minute)
  else if (period === "hourly")
    cryptoUrl = `https://min-api.cryptocompare.com/data/v2/histohour?api_key=${APIKEY}&fsym=${cmid}&tsym=${currency}&limit=48`;
  // last 48 hours (so 48 period of 1 hour)
  else if (period === "daily")
    cryptoUrl = `https://min-api.cryptocompare.com/data/v2/histoday?api_key=${APIKEY}&fsym=${cmid}&tsym=${currency}&limit=60`;
  // last 60 days (so 60 period of 1 day)
  else {
    return res.status(400).json({
      status: 400,
      message: "Period must eather be 'daily', 'hourly' or 'minute'.",
    });
  }

  axios({
    method: "get",
    url: cryptoUrl,
  }).then((response) => {
    return res.status(200).json({
      status: 200,
      message: "Crypto retrieved.",
      data: response.data.Data,
    });
  });
});

// adds one crypto to the platform
router.post("/", AuthMiddleware, async function (req, res) {
  let user = await User.find({ _id: req.user.id }, {}, { upsert: true }).exec();

  if (user && user[0].role !== "admin") {
    return res.status(400).json({
      status: 400,
      message: "Only admin can add new crypto to the platform.",
    });
  }

  if (!req.body) {
    return res.status(400).json({
      status: 400,
      message: "Request error",
    });
  } else if (!req.body.id) {
    return res.status(400).json({
      status: 400,
      message: "Missing crypto id.",
    });
  } else if (!req.body.full_name) {
    return res.status(400).json({
      status: 400,
      message: "Missing crypto full name.",
    });
  } else if (!req.body.image_url) {
    return res.status(400).json({
      status: 400,
      message: "Missing crypto image url.",
    });
  }

  const cryp = new Crypto({
    id: req.body.id,
    full_name: req.body.full_name,
    image_url: req.body.image_url,
  });

  await cryp.save(function (err) {
    if (err) {
      return res.status(400).json({
        status: 400,
        message: err.errors.id
          ? "This crypto is already present on the platform."
          : err.errors.full_name
          ? "Full name already taken"
          : err.errors.image_url
          ? "Image url already taken"
          : "An error occured",
      });
    } else {
      return res.status(200).json({
        status: 200,
        message: "Crypto added",
      });
    }
  });
});

// deletes crypto from the platform
router.delete("/:id", AuthMiddleware, async function (req, res) {
  let user = await User.find({ _id: req.user.id }, {}, { upsert: true }).exec();

  if (user && user[0].role !== "admin") {
    return res.status(400).json({
      status: 400,
      message: "Only admin can remove a crypto to the platform.",
    });
  }

  var query = { id: req.params.id };

  Crypto.deleteOne(query, function (err, doc) {
    if ((err && err.name === "CastError") || (doc && doc.deletedCount < 1)) {
      return res.status(400).json({
        status: 400,
        message: "This crypto is not present on the platform.",
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

// gets all coins info (call only one time at beginning of application)
router.get("/all/_all", async function (req, res) {
  if (!req.body) {
    return res.status(400).json({
      status: 400,
      message: "Request error",
    });
  }

  const coinsURL = `https://min-api.cryptocompare.com/data/all/coinlist?api_key=${APIKEY}`;

  axios({
    method: "get",
    url: coinsURL,
  }).then((response) => {
    let coins = response.data.Data;
    Object.keys(coins).map(function (firstKey, index) {
      Object.keys(coins[firstKey]).map(function (key, index) {
        if (key !== "FullName") {
          delete coins[firstKey][key];
        }
      });
    });
    console.log(coins);
  });
});

module.exports = router;
