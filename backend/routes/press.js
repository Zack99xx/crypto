var express = require('express')
var router = express.Router()
const cc = require('cryptocompare')
var env = require('../config/index.js')

const APIKEY = env.cryptoAPIkey
cc.setApiKey(APIKEY)

var Article = require('../models/article.js')

// returns last published articles
router.get('/', async function (req, res) {
  let articles = await Article.find({}).limit(20).sort('-date')

  return res.status(200).json({
    status: 200,
    message: "Articles retrieved.",
    data: articles
  })
})

// returns an article
router.get('/:id', async function (req, res) {
  var query = {'id': req.params.id}

  Article.find(query, {}, {upsert: true}, function(err, doc) {
    if (err && err.name === 'CastError') {
      return res.status(400).json({
        status: 400,
        message: 'No article with this id.',
      })
    } else if (err) {
      return res.status(400).json({
        status: 400,
        message: err.message,
      })
    } else if (doc.length < 1) {
      return res.status(400).json({
        status: 400,
        message: 'No article with this id.',
      })
    }
    return res.status(200).json({
        status: 200,
        message: 'Article found.',
        data: doc
    })
  })
})

module.exports = router