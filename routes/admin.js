var express = require('express');
var router = express.Router();

const Product = require('../models/Product');
// const Cart = require('../../models/Cart');
 const Order = require('../models/Order') ;

 const { check, validationResult } = require('express-validator');
 const mongoose = require('mongoose') ;




mongoose.connect('mongodb://localhost/Shopping-cart' ,{useNewUrlParser : true} ,(error)=>{
  if(error){
    console.log(error)
  }else{
    console.log('Connecting to insert into db .....')
  }
})


router.get('/orders' , (req , res , next)=>{

    Order.find( (err,result)=>{
        if(err){    
            console.log(err)}
    
            console.log(result)

       res.render('admin/orders',{usersOrders: result});


     })
})

router.get('/addproduct' , (req , res , next)=>{
    var pname = "";
    var pstorage = "";
    var pprice = "";
    var presolution ="";
    var psize ="";
    var pnum= "";
    var errors ="";

    res.render('admin/add_product' , {
        errors:errors,

        pname:pname,
        pstorage:pstorage,
        pprice:pprice,
        presolution:presolution,
        psize:psize,
        pnum :pnum
    
    
    
});
  

});



/*
 * POST add product
 */
// router.post('/addproduct', function (req, res) {

//  //   var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

//     req.checkBody('pname', 'Name must have a value.').notEmpty();
//     req.checkBody('pstorage', 'Storage Capacity must have a value.').notEmpty();
//     req.checkBody('pprice', 'Price must have a value.').isDecimal();
//     req.checkBody('presolution', 'Resolution must have a value.').notEmpty();
//     req.checkBody('psize', 'display size must have a value.').notEmpty();
//    // req.checkBody('image', 'You must upload an image').isImage(imageFile);

//     // Apple iPhone X
//     // Storage Capacity : 64 GB
//     // Number Of SIM : Dual SIM
//     // Rear Camera Resolution : 12 MP
//     // Display Size (Inch) : 5.5 Inch

//     var pname = req.body.pname;
//     var slug = pname.replace(/\s+/g, '-').toLowerCase();
//     var pstorage = req.body.pstorage;
//     var pprice = req.body.pprice;
//     var presolution = req.body.presolution;
//     var psize = req.body.psize;

//     var errors = req.validationErrors();

//     if (errors) {
        
//         res.render('admin/add_product', {
//             errors: errors,
//             pname:pname,
//             pstorage:pstorage,
//             pprice:pprice,
//             presolution:presolution,
//             psize:psize,
//         });
   
//     } else {
//         Product.findOne({pname: pname}, function (err, product) {
//             if (product) {
//                 req.flash('danger', 'Product name exists, choose another.');
             
//                     res.render('admin/add_product', {
//                         pname:pname,
//                         pstorage:pstorage,
//                         pprice:pprice,
//                         presolution:presolution,
//                         psize:psize,
//                     });
               
//             } else {

//                 var price2 = parseFloat(pprice).toFixed(2);

//                 var product = new Product({
//                     pname:pname,
//                     pstorage:pstorage,
//                     pprice:pprice,
//                     presolution:presolution,
//                     psize:psize,
//                   //  image: imageFile
//                 });

//                 product.save(function (err) {
//                     if (err)
//                         return console.log(err);

//                     mkdirp('public/product_images/' + product._id, function (err) {
//                         return console.log(err);
//                     });

//                     mkdirp('public/product_images/' + product._id + '/gallery', function (err) {
//                         return console.log(err);
//                     });

//                     mkdirp('public/product_images/' + product._id + '/gallery/thumbs', function (err) {
//                         return console.log(err);
//                     });

//                     // if (imageFile != "") {
//                     //     var productImage = req.files.image;
//                     //     var path = 'public/product_images/' + product._id + '/' + imageFile;

//                     //     productImage.mv(path, function (err) {
//                     //         return console.log(err);
//                     //     });
//                     // }

//                     req.flash('success', 'Product added!');
//                     res.redirect('/'); /***************************mo2qtn */
//                 });
//             }
//         });
//     }

// });








router.post('/addproduct', [
 //   var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
    check('pname').not().isEmpty().withMessage( 'Name must have a value.'),
    check('pstorage').not().isEmpty().withMessage( 'Storage Capacity must have a value.'),
    check('pprice').not().isEmpty().withMessage('Price must have a value.'),
    check('presolution').not().isEmpty().withMessage('Resolution must have a value.'),
    check('psize').not().isEmpty().withMessage( 'display size must have a value.'),
    check('pnum').not().isEmpty().withMessage( 'display size must have a value.'),
    // req.checkBody('image', 'You must upload an image').isImage(imageFile);

   
  
], (req, res, next) => {

    var pname = req.body.pname;
    var slug = pname.replace(/\s+/g, '-').toLowerCase();
    var pstorage = req.body.pstorage;
    var pprice = req.body.pprice;
    var presolution = req.body.presolution;
    var psize = req.body.psize;
    var pnum= req.body.pnum;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {


         var validationMassages = [];
        for (var i = 0; i < errors.errors.length; i++) {
          validationMassages.push(errors.errors[i].msg)
        }
  

        res.render('admin/add_product', {
            errors:validationMassages,
            pname:pname,
            pstorage:pstorage,
            pprice:pprice,
            presolution:presolution,
            psize:psize,
            pnum:pnum
            
        });

        
       // return;
    } else {
                       //lessa 3yza a check if already exists
        var price2 = parseFloat(pprice).toFixed(2);

        var products=[ new Product({

          //  imagePath: imageFile,
        
            productName:pname ,
        
            information: {
                storageCapacity: pstorage ,
                numberOfSIM: pnum , 
                cameraResolution: presolution, 
                displaySize : psize ,
                
        
            } ,
        
            price: price2 ,
        }),
    ]

        var done = 0 ;

for( var i = 0 ; i < products.length ; i++){
    products[i].save((error , doc)=>{
        if(error){
            console.log(error)
        }
        console.log(doc)
        done ++
        if(done === products.length) { 
            mongoose.disconnect();
        }
    })
}


req.flash('success', 'Product added!');
//res.redirect('/');
    

    

       /// mongoose.disconnect();
        
  

    }//end else
       // req.flash('success', 'Product added!');
        //res.redirect('/');
     //  return;
      /*  product.save(function (err) {
            if (err)
                return console.log(err);

            mkdirp('public/product_images/' + product._id, function (err) {
                return console.log(err);
            });

            mkdirp('public/product_images/' + product._id + '/gallery', function (err) {
                return console.log(err);
            });

            mkdirp('public/product_images/' + product._id + '/gallery/thumbs', function (err) {
                return console.log(err);
            });

            // if (imageFile != "") {
            //     var productImage = req.files.image;
            //     var path = 'public/product_images/' + product._id + '/' + imageFile;

            //     productImage.mv(path, function (err) {
            //         return console.log(err);
            //     });
            // }

            req.flash('success', 'Product added!');
            res.redirect('/'); /***************************mo2qtn 
        });*/
    
});



module.exports = router;

