var express = require('express');
var router = express.Router();
var Book = require('../models/book');
//const Book = require('../models').Book;

/* GET home page. */
router.get('/', async function(req, res, next) {
  var booksById = await Book.findAll();
  res.json('index')
  console.log(booksById.toJSON());
});

module.exports = router;
