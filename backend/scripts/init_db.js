var User = require('../models/user.js')
var Crypto = require('../models/crypto.js')
var Article = require('../models/article.js')
var Rss = require('../models/rssFeed.js')

var fixtures = require('../fixtures/fixtures.json')

var mongoose = require('mongoose')

var mongoDB = 'mongodb+srv://Admin:AdminTest00@cluster0.murir.mongodb.net/test?retryWrites=true&w=majority'
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    if (error)
      console.log("MongoDB connection error: " + error)
  }
)

const addUsers = async () => {
  await User.deleteMany({})

  fixtures.users.forEach((user) => {
    const us = new User({
      role: user.role,
      email: user.email,
      username: user.username,
      favorites: user.favorites,
    })

    us.setPassword(user.password)

    us.save()
  })
}

const addCryptos = async () => {
  await Crypto.deleteMany({})

  fixtures.cryptos.forEach((crypto) => {
    const cryp = new Crypto({
      id: crypto.id,
      full_name: crypto.full_name,
      image_url: crypto.image_url,
    })

    cryp.save()
  })
}

const addRss = async () => {
  await Rss.deleteMany({})

  fixtures.rss.forEach((rss) => {
    const rssFeed = new Rss({
      key: rss.key,
      image_url: rss.image_url,
    })

    rssFeed.save()
  })
}

(async () => {
  try {
    console.log('Loading users...')
    await addUsers()
    console.log('Loading cryptos...')
    await addCryptos()
    console.log('Loading rss feeds...')
    await addRss()
    console.log('Success !')
  } catch (error) {
    console.log(error.message)
  }
})()