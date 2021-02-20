var express = require('express');
var router = express.Router();
const Product = require('../models/Product');
const { check, validationResult } = require('express-validator');
const admin = require('../models/admin');
const passport = require('passport');
const csrf = require('csurf');
router.use(csrf());
router.get('/signinadmin', isNotSignin, (req, res, next) => {
    var massagesError = req.flash('signinError');
    res.render('admin/signinadmin', { massages: massagesError, token: req.csrfToken() });
})

router.get('/profileadmin', function (req, res, next) {

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
            title: 'Shopping-cart'
            , products: productGrid,
            checkuser: req.isAuthenticated(),
            totalProducts: totalProducts,
            successMas: successMas,
        });
    })

})


router.post('/signinadmin', [
    check('email').not().isEmpty().withMessage('please enter your email'),
    check('email').isEmail().withMessage('please enter valid email'),
    check('password').not().isEmpty().withMessage('please enter your password'),
    check('password').isLength({ min: 5 }).withMessage('please enter pssword more than 5 char'),

], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        var validationMassages = [];
        for (var i = 0; i < errors.errors.length; i++) {
            validationMassages.push(errors.errors[i].msg)
        }
        req.flash('signinError', validationMassages);
        res.redirect('signinadmin')

        return;
    }
    next();


}, passport.authenticate('local-signin', {
    successRedirect: 'profileadmin',
    failureRedirect: 'signinadmin',
    failureFlash: true,
}))
router.get('/logout', isSignin, (req, res, next) => {
    req.logOut();
    res.redirect('/')

})

function isSignin(req, res, next) {
    if (!req.isAuthenticated()) {
        res.redirect('signinadmin')
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



router.get('/editproductdescription/:id', function (req, res) {
    console.log(req.params.id);
        // console.log(product);
    Product.findById(req.params.id, function (err, product) {
        console.log(req.params.id);
        console.log(product);
        var product=product;
        if (err)
            return console.log(err);
        res.render('admin/editproductdescription', {
            title: 'Shopping-cart',
            product:product
            //, products: productGrid,
            // checkuser: req.isAuthenticated(),
            // totalProducts: totalProducts,
            // successMas: successMas
        });
    });
});
router.post('/editproductdescription/:id', function (req, res) {
    var price = req.body.price;
    var id = req.params.body;
    if (errors) {

        req.session.errors = errors;
        res.redirect('/admin/editproductdescription');
        console.log("error");
    }
    console.log("enter");

});



module.exports = router;



