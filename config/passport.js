const passport = require('passport');
const localStrategy = require('passport-local').Strategy; //7gbha men passport local .strategy 7trg3 class 
const User = require('../models/User'); //gbt el schema 
const Cart = require('../models/Cart');


passport.serializeUser((user, done) => { //bt5od el done ely rg3 m4n fn el strategy
    return done(null, user.id); //bb3t id 3shan a3rf agibo mno fy 2y w2t 
})

passport.deserializeUser((id, done) => { //bidour 3ala el sh5s ely by el id dh w y7to  fy el seesion 
    User.findById(id, ('email userName contact address image'), (err, user) => {
        Cart.findById(id, (err, cart) => {
            if (!cart) {
                return done(err, user)
            }
            user.cart = cart;
            return done(err, user);
        })
    })
})

passport.use('local-signin', new localStrategy({ //3mlt 2sm el strategy bt3ty 2smha local-signin 
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true, //b3d ma t5ls ro7 llcallback 
}, (req, email, password, done) => { //b3ml compare bino w bain ely fy el user  el done dh rd el sh5s 3lya 


    User.findOne({ email: email }, (err, user) => { //email el schema ly email ely gily men el fn w rdha ya err ya user
        if (err) {
            return done(err)
        }

        if (!user) {
            return done(null, false, req.flash('signinError', 'this user not found')) // mfish user 7b3to 3shan kda false 
        }
        if (!user.comparePassword(password)) {
            return done(null, false, req.flash('signinError', 'wrong password')) //el password 8alt 
        }

        return done(null, user) //tl3 el user 
    })

}))


passport.use('local-signup', new localStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({ email: email }, (err, user) => {
        if (err) {
            return done(err)
        }
        if (user) {
            return done(null, false, req.flash('signupError', 'this eamil already exist')) //minf3sh tsgl enta mowgod asln 
        }
        const newUser = new User({ //low sh5s gdid 
            email: email,
            password: new User().hashPassword(password),
        })

        newUser.save((err, user) => {
            if (err) {
                return done(err)
            }
            return done(null, user);
        })
    })
}))