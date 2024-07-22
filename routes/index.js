var express = require('express');
var router = express.Router();
var { Book } = require('../models/');
const { Op } = require("sequelize");

let bookstatus = "";
let bookstatusanimation = "focus-in-expand";

/* GET home page. */
router.get(`/`, function(req, res, next){
  res.redirect('/books');
});

router.get('/books', async function(req, res, next) {
  var booksById = await Book.findAll();
  //res.json(booksById);
  //console.log(booksById);
  res.locals.allBooks = booksById;
  res.locals.bookstatus = bookstatus;
  res.locals.bookstatusanimation = bookstatusanimation;
  bookstatus = "";
  res.render('all-books');
});

router.post('/books', async function(req, res, next) {
  console.log(`SEARCHING FOR BOOKS:`);
  console.log(req.body.searchterm);
  let search = req.body.searchterm;
  try{
    const bookResults = await Book.findAll({
      where: {
        [Op.or]:{
          author:  {
            [Op.like]: `%${search}%`
          },
          title:  {
            [Op.like]: `%${search}%`
          },
          genre:  {
            [Op.like]: `%${search}%`
          },
          year:  {
            [Op.like]: `%${search}%`
          }
        }
        
      }
    });
    console.log("----RESULTS:");
    console.log(bookResults);
    res.locals.bookstatus = `Results found for '${search}'`
    res.locals.bookstatusanimation = 'heartbeat';
    res.locals.allBooks = bookResults;
    res.render('all-books');
  }catch(error){
    console.log("---ERROR FINDING BOOK RESULTS");
    console.log(error);
    res.locals.errormessage = "Oops! There was an error:";
    // throw error;
    res.render('book-not-found');
  }
  

});

router.get('/books/new', async function(req, res, next) {
  res.render('new-book');
});

router.post('/books/new', async function(req, res, next) {
  console.log("-----CREATING NEW BOOK!!");
  console.log(req.body);
  const bookAttempt = req.body;

  res.locals.errormessage = "";
  res.locals.errorList = [];

  try{
    const book = await Book.create({
      ...bookAttempt
    });
    bookstatus = "New Book Created!";
    bookstatusanimation = "bounce-in-left";
    res.redirect('/books');
  }catch(error){
    console.log("---ERROR connecting to database: " + error);
    if(error.name === 'SequelizeValidationError'){
        let errList = error.errors.map(err => err.message);
        res.locals.bookAttempt = bookAttempt;
        res.locals.errormessage = "Ahem. There are a few issues...";
        res.locals.errorList = errList;
    }else{
        res.locals.errormessage = "Oops! There was an error:";
        throw error;
    }
    res.render('new-book-errors');
  }
  
});

router.post('/books/:id/delete', async function(req, res, next) {
  console.log("-----DELETING BOOK!!");
  const book = await Book.findByPk(req.params.id);
  await book.destroy();
  bookstatus = "Book Deleted!";
  bookstatusanimation = "slide-out-blurred-right";
  res.redirect('/books');
});

router.get('/books/:id', async function(req, res, next) {
  console.log(`LOOKING FOR BOOK ID: ${req.params.id} `);
  try{
    const book = await Book.findAll({
      where:{
        id: req.params.id
      }
    });
    console.log(`FOUND IT? ${book[0].title}`);
    res.locals.book = book[0];
    res.render('update-book');
  }catch(error){
    console.log("---ERROR FINDING BOOK ID");
    res.locals.errormessage = "Oops! There was an error:";
    // throw error;
    res.render('book-not-found');
  }
  

});

router.post('/books/:id', async function(req, res, next){
  console.log(`UPDATING BOOK ID: `);
  console.log(req.body);

  try {
    let data = await Book.findOne({
      where: {
        id: req.params.id
      }
    });
    if (data) {
      await Book.update(req.body, { where: { id: req.params.id } });
      bookstatus = "Book Updated!";
      bookstatusanimation = "focus-in-expand";
      console.log("-----DATA FOUND!");
    }
    else {
      console.log("-----NO DATA FOUND!");
    }
  } catch (err) {
    console.log("-----SERVER ERROR!")
    console.log(err);
  };

  res.redirect('/books');
})

module.exports = router;
