
// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/signupadmin',/* isNotSignin, */function(req, res, next) {
//     // var massagesError = req.flash('signupError')
//     res.render('admin/signupadmin'/*, { massages: massagesError, token: req.csrfToken() }*/);
// });


// router.get('/signinadmin', /*isNotSignin,*/ (req, res, next) => {
//     // var massagesError = req.flash('signinError');
//     res.render('admin/signinadmin'/*, { massages: massagesError, token: req.csrfToken() }*/);
// })


var express = require('express');
var router = express.Router();
const Product = require('../models/Product');

const { check, validationResult } = require('express-validator');
const admin= require('../models/admin');
const passport = require('passport');
// const fs = require('fs');
// const fileFilter = function(req, file, cb) {
//     if (file.mimetype === 'image/jpeg') {
//         cb(null, true)
//     } else {
//         cb(new Error('please upload jpeg image'), false);
//     }
// }

const csrf = require('csurf');
// router.use(upload.single('myfile'), (err, req, res, next) => {
//     if (err) {
//         req.flash('profileImageError', [err.message]);
//         res.redirect('profile');
//     }
// });
router.use(csrf());

/* GET users listing. */
router.get('/signupadmin', isNotSignin, function(req, res, next) {
    var massagesError = req.flash('signupError')
    res.render('admin/signupadmin', { massages: massagesError, token: req.csrfToken() });
});


router.get('/signinadmin', isNotSignin, (req, res, next) => {
    var massagesError = req.flash('signinError');
    res.render('admin/signinadmin', { massages: massagesError, token: req.csrfToken() });
})
router.post('/signupadmin', [
    check('email').not().isEmpty().withMessage('please enter your email'),
    check('email').isEmail().withMessage('please enter valid email'),
    check('password').not().isEmpty().withMessage('please enter your password'),
    check('password').isLength({ min: 5 }).withMessage('please enter pssword more than 5 char'),
    check('confirm-password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('password and confirm-password not matched')
        }
        return true;
    })

], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {


        var validationMassages = [];
        for (var i = 0; i < errors.errors.length; i++) {
            validationMassages.push(errors.errors[i].msg)
        }

        req.flash('signupError', validationMassages);
        res.redirect('signupadmin')

        return;
    }
    next();
}, passport.authenticate('local-signup', {
    session: false, //22fly el session
    successRedirect: 'signinadmin', //ng7 el sign up ro7  llsign in 
    failureRedirect: 'signupadmin', //fshl 5liky fy el sign up
    failureMessage: true
}))

/*
router.get('/profileadmin', isSignin, (req, res, next) => {
    res.render('admin/profileadmin')
})
*/
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
        totalProducts: totalProducts ,
        successMas : successMas ,
      });
    })
  
  })

router.get('/signinadmin', isNotSignin, (req, res, next) => {
    var massagesError = req.flash('signinError');
    res.render('admin/signinadmin', { massages: massagesError, token: req.csrfToken() });
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
// var emailinput = req.body.email;
// var passwordinput= req.body.password;
// if(emailinput == 'marwa'){​​​​​
// if(passwordinput== "123456"){​​​​​
//  req.session.user={​​​​​
//  email:emailinput,
//  password:passwordinput
//  }​​​​​
// res.redirect('/admin/signinadmin');
// }​​​​​else{​​​​​
// res.redirect('/admin/signinadmin');
// }​​​​​
// }​​​​​
// else{​​​​​
// res.redirect('/admin/signinadmin');
// }​​​​​
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






module.exports = router;


//******************************* */

    
// router.get('/login', function(req, res){​​​​​
// if(!req.session.user && !req.cookies.user_sid){​​​​​
// res.render('admin/login/index', {​​​​​layout: 'admin-raw'}​​​​​)
// }​​​​​else{​​​​​
// res.redirect('/admin/dashbord');
// }​​​​​
// }​​​​​)

// router.post('/login',(req,res)=>{​​​​​
// var username = req.body.username;
// var password = req.body.password;
// if(username == 'admin'){​​​​​
// if(password == "admin"){​​​​​
// req.session.user={​​​​​
// username:username,
// password:password
// }​​​​​
// res.redirect('/admin/dashbord');
// }​​​​​else{​​​​​
// res.redirect('/admin/login');
// }​​​​​
// }​​​​​
// else{​​​​​
// res.redirect('/admin/login');
// }​​​​​
// }​​​​​);
