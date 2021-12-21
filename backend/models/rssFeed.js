var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

var RssSchema = new mongoose.Schema(
  {
    key: {type: String, unique: true, required: [true, "can't be blank"], index: true},
    image_url: {type: String, unique: true, required: [true, "can't be blank"], index: true},
  },
  {
    timestamps: true
  },
)

RssSchema.plugin(uniqueValidator, {message: 'is already taken.'})

var Rss = mongoose.model('Rss', RssSchema)

module.exports = Rss
