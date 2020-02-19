var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    token: String,
    salt: String,
    country: String,
    lang: String,
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'articles' }],
});

var userModel = mongoose.model('users', userSchema);

module.exports = userModel;