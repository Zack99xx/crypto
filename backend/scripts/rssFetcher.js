var express = require('express')
const CronJob = require('cron').CronJob
const axios = require('axios')
var env = require('../config/index.js')

const APIKEY = env.cryptoAPIkey

var Rss = require('../models/rssFeed.js')
var Article = require('../models/article.js')

var mongoose = require('mongoose')

var mongoDB = 'mongodb+srv://Admin:AdminTest00@cluster0.murir.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    if (error)
      console.log("MongoDB connection error: " + error)
  }
)

// returns all rss feeds available
const getRssFeedsList = async () => {
  let list = await Rss.find()

  return list
}

// returns all rss feeds history
const getRssHistory = async () => {
  let feeds = await getRssFeedsList()
  let requests = []
  let url

  console.log('Fetching feeds history...')
  for (let feed of feeds) {
    console.log('Fetching ', feed.key, '...')
    url = `https://min-api.cryptocompare.com/data/v2/news/?lang=EN&feeds=${feed.key}`
    let promise = axios.get(url)
    requests.push(promise)
  }
  console.log('History fetched !')
  let data = await Promise.all(requests)

  for (let res of data) {
    for (let article of res.data.Data) {
      const art = new Article({
        id: article.id,
        title: article.title,
        summary: article.body,
        source: article.source,
        date: article.published_on,
        page_url: article.url,
        image_url: article.imageurl,
      })

      art.save(function(err) {})
    }
  }
  console.log('Articles updated!')
  return
}

(async () => {
  try {
    await getRssHistory()
    const rssJob = new CronJob('*/5 * * * *', () => {
      getRssHistory()
    })
    rssJob.start()
  } catch (error) {
    console.log(error.message)
  }
})()