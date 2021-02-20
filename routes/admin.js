var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();
const { check, validationResult } = require('express-validator');
const passport = require('passport');
var express = require('express');
var router = express.Router();

const Product = require('../models/Product');
// const Cart = require('../../models/Cart');
const Order = require('../models/Order');


const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Shopping-cart', { useNewUrlParser: true }, (error) => {
    if (error) {
        console.log(error)
    } else {
        console.log('Connecting to insert into db .....')
    }
})

router.get('/signin', isNotSignin, (req, res, next) => {
    var massagesError = req.flash('signupError')
    res.render('./admin/signin', { massages: massagesError, layout: 'layoutadmin', checkuser: true, checkprofile: false });
})
router.post('/signin', [check('email').not().isEmpty().withMessage('please enter your email'),
    check('email').isEmail().withMessage('please enter valid email'),
    check('password').not().isEmpty().withMessage('please enter your password'),

    check('confirm-password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('password or mail are not correct')
        }
        return true;
    })
], (req, res, next) => {
    const errors = validationResult(req);
    var validationMassages = [];
    for (var i = 0; i < errors.errors.length; i++) {
        validationMassages.push(errors.errors[i].msg)
    }
    var username = req.body.email;
    var password = req.body.password;
    if (username == 'admin@gmail.com') {
        if (password == "admin") {
            req.session.user = { username: username, password: password }
            res.redirect('./profileadmin');
        } else {
            req.flash('signupError', validationMassages);
            console.log("password not excits")
            res.redirect('./signin');
        }
    } else {
        req.flash('signupError', validationMassages);
        console.log("email not excits")
        res.redirect('./signin');
    }
})


router.get('/profileadmin', function(req, res, next) {

    if (!req.session.user && !req.cookies.user_sid) {
        res.redirect('/admin/signin');
    }
    else {

    const successMas = req.flash('success')[0];
    var totalProducts = null;

    Product.find({}, (error, doc) => {
        if (error) {
            console.log(error)
        }
        var productGrid = [];
        var colGrid = 3;

        for (var i = 0; i < doc.length; i += colGrid) {
            productGrid.push(doc.slice(i, i + colGrid))
        }
        res.render('admin/profileadmin', {
            title: 'Shopping-cart',
            products: productGrid,
            checkuser: true,
            checkprofile: true,
            totalProducts: totalProducts,
            successMas: successMas,
            layout: 'layoutadmin',
        });
    })



}
})
router.get('/editproductdescription/:id', function(req, res) {
    if (!req.session.user && !req.cookies.user_sid) {
        res.redirect('/admin/signin');
    }
    else {
    console.log(req.params.id);
    // console.log(product);
    Product.findById(req.params.id, function(err, product) {
        console.log(req.params.id);
        console.log(product);
        var product = product;
        if (err)
            return console.log(err);
        res.render('admin/editproductdescription', {
            title: 'Shopping-cart',
            layout: 'layoutadmin',
            checkuser: true,
            checkprofile: true,
            product: product

        });
    });

}
});


router.post('/editproductdescription/:id', upload.none(), [

    check('price').not().isEmpty().withMessage('Price must have a value.'),

], (req, res, next) => {

    var storage = req.body.title;

    var camera = req.body.camera;
    var price = req.body.price;
    var sim = req.body.sim;
    var size = req.body.size;
    console.log("EDITED SIZE-----------" + req.body.size);
    var id = req.params.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        var validationMassages = [];
        for (var i = 0; i < errors.errors.length; i++) {
            validationMassages.push(errors.errors[i].msg)
        }
        res.render('admin/editproductdescription', {
            errors: validationMassages,

        });

    } else {
        Product.findById(id, function(err, p) {
            if (err)
                console.log(err);
            // p.information.storageCapacity = parseFloat(storage);
            // p.information.cameraResolution = parseFloat(camera);
            // p.information.numberOfSIM = sim;
            // p.information.displaySize = parseFloat(size);
            p.price = parseFloat(price);




            p.save((error, doc) => {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>/n" + p)
                if (error) {
                    console.log(error)
                }
                console.log(doc)
                req.flash('success', 'Product Edited!');

                res.redirect('/admin/profileadmin')

                //mongoose.disconnect();
            });



        });
    }


});

function isSignin(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('signin')
        return;
    }
    next();
}

function isNotSignin(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/')
        return;
    }
    next(); //5osh 3ala el call back fn
}


router.get('/orders', (req, res, next) => {
    if (!req.session.user && !req.cookies.user_sid) {
        res.redirect('/admin/signin');
    }
    else {
    Order.find((err, result) => {
        if (err) {
            console.log(err)
        }

        console.log(result)

        res.render('admin/orders', { usersOrders: result, layout: 'layoutadmin', checkuser: true, checkprofile: true });
    })
}
})

router.get('/addproduct', (req, res, next) => {
    if (!req.session.user && !req.cookies.user_sid) {
        res.redirect('/admin/signin');
    }
    else {
    var pname = "";
    var pstorage = "";
    var pprice = "";
    var presolution = "";
    var psize = "";
    var pnum = "";
    var errors = "";

    res.render('admin/add_product', {
        errors: errors,

        pname: pname,
        pstorage: pstorage,
        pprice: pprice,
        presolution: presolution,
        psize: psize,
        pnum: pnum,
        checkuser: true,
        checkprofile: true,
        layout: 'layoutadmin',



    });
}

});


router.post('/addproduct', upload.none(), [
    //   var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";
    check('pname').not().isEmpty().withMessage('Name must have a value.'),
    check('pstorage').not().isEmpty().withMessage('Storage Capacity must have a value.'),
    check('pprice').not().isEmpty().withMessage('Price must have a value.'),
    check('presolution').not().isEmpty().withMessage('Resolution must have a value.'),
    check('psize').not().isEmpty().withMessage('display size must have a value.'),
    check('pnum').not().isEmpty().withMessage('Number of SIM must have a value.'),
    // req.checkBody('image', 'You must upload an image').isImage(imageFile);



], (req, res, next) => {
    // ************
    var pimage=req.body.image;

    console.log("image path IS:" + req.body.image);
    console.log("type image path IS:" + typeof(req.body.image));

    var pimagef='/images/'+req.body.image;
    console.log("image path final IS:" + pimagef);

    var pname = req.body.pname;
    //var slug = pname.replace(/\s+/g, '-').toLowerCase();
    var pstorage = req.body.pstorage;
    var pprice = req.body.pprice;
    var presolution = req.body.presolution;
    var psize = req.body.psize;
    var pnum = req.body.pnum;
    console.log("PRODUCT NAME IS:" + req.body.pname);
    console.log("*************************************************");

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        var validationMassages = [];
        for (var i = 0; i < errors.errors.length; i++) {
            validationMassages.push(errors.errors[i].msg)
        }


        res.render('admin/add_product', {
            errors: validationMassages,
            /*** */
            pimagef:pimagef,
            pname: pname,
            pstorage: pstorage,
            pprice: pprice,
            presolution: presolution,
            psize: psize,
            pnum: pnum,
            checkuser: true,
            checkprofile: true,
            layout: 'layoutadmin',

        });


        // return;
    } else {
        //lessa 3yza a check if already exists
        var price2 = parseFloat(pprice).toFixed(2);

        var products = [new Product({

            //  imagePath: imageFile,
            imagePath: pimagef,
            productName: pname,

            information: {
                storageCapacity: pstorage,
                numberOfSIM: pnum,
                cameraResolution: presolution,
                displaySize: psize,


            },

            price: price2,
        }), ]

        var done = 0;

        for (var i = 0; i < products.length; i++) {
            products[i].save((error, doc) => {
                if (error) {
                    console.log(error)
                }
                console.log(doc)
                done++
                if (done === products.length) {
                    //mongoose.disconnect();
                req.flash('success', 'Product Added!');

                res.redirect('/admin/profileadmin')
                }
            })
        }


        //req.flash('success', 'Product added!');


    }
});
router.get('/logout', isSignin, (req, res, next) => {
    req.logOut();
    res.redirect('/')

})




module.exports = router;