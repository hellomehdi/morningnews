var mongoose = require('mongoose');

var articleSchema = mongoose.Schema({
    title: String,
    description: String,
    content: String,
    urlToImage: String,
    country: String
});
  
var articleModel = mongoose.model('articles', articleSchema);

module.exports = articleModel;