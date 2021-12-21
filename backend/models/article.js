var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')

var ArticleSchema = new mongoose.Schema(
  {
    id: {type: String, unique: true, required: [true, "can't be blank"], index: true},
    title: {type: String, unique: false, required: [true, "can't be blank"]},
    summary: {type: String, unique: false, required: [true, "can't be blank"]},
    source: {type: String, unique: false, required: [true, "can't be blank"]},
    date: {type: String, unique: false, required: [true, "can't be blank"]},
    page_url: {type: String, unique: false, required: [true, "can't be blank"]},
    image_url: {type: String, unique: false, required: [true, "can't be blank"]},
  },
  {
    timestamps: true
  },
)

ArticleSchema.plugin(uniqueValidator, {message: 'is already taken.'})

var Article = mongoose.model('Article', ArticleSchema)

module.exports = Article
