var express = require('express');
var router = express.Router();
var request = require('sync-request');

var userModel = require('../models/users'); //Exploite le modèle users
var articleModel = require('../models/articles'); //Exploite le modèle articles

// Requires pour le cryptage
var uid2 = require("uid2");
var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");


/* POST LOGIN ACTION */
router.post('/login', async function (req, res) {

  var result = false;
  var errors = [];

  if(req.body.email.length < 1 || req.body.password.length < 1 || req.body.email.includes("@") === false) {

    errors.push("Please enter correct credentials");
    res.json({result, errors});

  } else if(await userModel.findOne( { email: req.body.email } ) === null){

    errors.push("Email not found");
    res.json({result, errors});

  } else {

    var user = await userModel.findOne( { email: req.body.email } ).exec(function (err, user) {
      var hash = SHA256(req.body.password + user.salt).toString(encBase64);
  
      if (hash === user.password) {
        result = true;
        res.json({result, errors, user});
      } else {
        errors.push("Wrong login details");
        res.json({result, errors});
      }

    });

  }

});


/* POST SIGNUP ACTION */
router.post('/signup', async function (req, res) {

  var result = false;
  var errors = [];
  var emailAlreadyExists = await userModel.findOne( { email: req.body.email } );

  // IF CREDENTIALS ARE EMPTY OR INCORRECT
  if(req.body.username.length < 1 || req.body.email.length < 1 || req.body.password.length < 1 || req.body.email.includes("@") === false) {

    errors.push("Please enter correct credentials");
    res.json({result, errors});

  // IF NO ERRORS AND EMAIL NOT ALREADY IN DB
  } else if(errors.length === 0 && emailAlreadyExists === null) {

    var salt = uid2(32);
    var newUser = new userModel ({
      username: req.body.username,
      email: req.body.email,
      salt : salt,
      password: SHA256(req.body.password + salt).toString(encBase64),
      token: uid2(32),
      country: 'fr',
      lang: 'fr'
    });
    var userSaved = await newUser.save();

    // IF SIGNUP WENT GOOD OR WRONG
    if(userSaved){
      result = true;
      res.json({result, errors, userSaved});
    } else {
      errors.push("Please try again later");
      res.json({result, errors});
    };

  // IF NO ERRORS BUT EMAIL ALREADY EXISTS
  } else if(errors.length === 0 && emailAlreadyExists !== null) {

    errors.push("Email already exists");
    res.json({result, errors});
    
  };
  
});


/* POST ADD ARTICLE TO WISHLIST IN DB */
router.post('/add-to-wishlist', async function (req, res) {

  var articleExists = await articleModel.findOne({title: req.body.title});
  var newArticle;

  if(articleExists === null){
    newArticle = new articleModel ({
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      urlToImage: req.body.urlToImage,
      country: req.body.country
     });
    savedArticle = await newArticle.save();
  }

  newArticle = await articleModel.findOne({title: req.body.title});
  var user = await userModel.findOne({token: req.body.token}).populate('articles').exec();
  var userArticles = user.articles;
  userArticles.push(newArticle);

  await userModel.updateOne(
    {token: req.body.token}, // Filtre de la recherche
    {articles: userArticles} // Mise à jour des articles
  );

  res.json({result: true});
});


/* GET TOP RECENT ARTICLES FROM API */
router.get('/top-headlines', async function (req, res) {

  var APIresponse = request("GET", `http://newsapi.org/v2/top-headlines?sources=${req.query.id}&apiKey=${process.env.NEWSAPI_KEY}`);
  APIresponse = JSON.parse(APIresponse.getBody());
  
  res.json({articles: APIresponse.articles});

});


/* GET ALL ARTICLES IN WISHLIST FROM DB */
router.get('/wishlist', async function (req, res) {

  if(req.query.token === null) {

    // Do nothing

  } else {

    var user = await userModel.findOne({token: req.query.token}).populate('articles').exec();
    var userArticles = user.articles.filter(article => article.country === req.query.country);

    res.json({articles: userArticles});
  }

});


/* POST ADD COUNTRY TO USER */
router.post('/country', async function (req, res) {

  await userModel.updateOne(
    {token: req.body.token}, // Filtre de la recherche
    {country: req.body.country, lang: req.body.lang} // Mise à jour
  );

  res.json({result: true});
});


/* GET CURRENT LANG FROM DB */
router.get('/country', async function (req, res) {

  if(req.query.token === null) {

    // Do nothing

  } else {

    var user = await userModel.findOne({token: req.query.token});

    res.json({country: user.country, lang: user.lang});
  }

});


/* DELETE AN ARTICLE IN WISHLIST FROM DB */
router.delete('/wishlist/:token/:title', async function(req, res, next) {

  var user = await userModel.findOne({token: req.params.token}).populate('articles').exec(); // On cible le user
  var currentArticles = user.articles; // On récup les articles actuels
  var newWishlist = currentArticles.filter(article => article.title !== req.params.title); // On filtre l'article à suppr

  await userModel.updateOne(
    { token: req.params.token }, // Filtre de la recherche
    { articles: newWishlist } // Mise à jour des articles
  );

  res.json({articles: user.articles});
});


module.exports = router;
