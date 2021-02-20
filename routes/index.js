// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Shopping-cart' });
// });

// module.exports = router;




var express = require('express');
var router = express.Router();

const Product = require('../models/Product');
// const stripe = require('stripe')('sk_test_JjUgugHcOxWAbVVjcB5hwIjN00BHAya1o9');


/* GET home page. */
router.get('/', function (req, res, next) {

  Product.find({}, (error, doc) => {
    if (error) {
      console.log(error)
    }
    
    var productGrid = [];
    var colGrid = 3;

    for (var i = 0; i < doc.length; i += colGrid) {
      productGrid.push(doc.slice(i, i + colGrid))
    }

  
    res.render('index', {
      title: 'Shopping-cart'
      , products: productGrid

    });
  })


  })
  


module.exports = router;


