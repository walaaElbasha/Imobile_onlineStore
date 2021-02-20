var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
//const expressHbs = require('express-handlebars');

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express(); ////////////////n2ltaha here
/**************************************************************************************************/
var expressValidator = require('express-validator');
var admin = require('./routes/admin');
var fileUpload = require('express-fileupload');
/****************************************************************** */
const expressHbs = require('express-handlebars');
///////////was here
const Handlebars = require('handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

mongoose.connect('mongodb://localhost/Shopping-cart', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (error) => {
    if (error) {
        console.log(error)
    } else {
        console.log('Connecting to DB .....')
    }
})

require('./config/passport'); //ndit 3ala el mlf 7ibd2 y5sh goh w y3mlo run 


// view engine setup
app.engine('.hbs', expressHbs({
    defaultLayout: 'layout',
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
        add: function(value) {
            return value + 1;
        },
        checkQuantity: function(value) {}
    }
}))
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'Shopping-cart_?@!',
    saveUninitialized: false,
    resave: true, //el7gat el gdida ely 7t7sl 3ala el session 23mlha save 3ala el 2dim  (passport 7l2iha)
}));
app.use(flash());
app.use(passport.initialize()); //2owl ma yowsl hena howa 7ibd2 ydmg men 2owl ma ana 3mltlo config l7d el initlization
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

/*************************************new*************** */
// app.use(expressValidator()); 

app.use(fileUpload());
/******************************************************************* */
app.use('/', indexRouter);
app.use('/users', usersRouter);

/****************by admin but still needs auth************************************************************ */
app.use('/admin',admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


var port = 3000;
app.listen(port, function() {
    console.log('server started on port ' + port);
});

// app.use(expressValidator({
//     errorFormatter: function (param, msg, value) {
//         var namespace = param.split('.')
//                 , root = namespace.shift()
//                 , formParam = root;

//         while (namespace.length) {
//             formParam += '[' + namespace.shift() + ']';
//         }
//         return {
//             param: formParam,
//             msg: msg,
//             value: value
//         };
//     },
//     customValidators: {
//         isImage: function (value, filename) {
//             var extension = (path.extname(filename)).toLowerCase();
//             switch (extension) {
//                 case '.jpg':
//                     return '.jpg';
//                 case '.jpeg':
//                     return '.jpeg';
//                 case '.png':
//                     return '.png';
//                 case '':
//                     return '.jpg';
//                 default:
//                     return false;
//             }
//         }
//     }
// }));
module.exports = app;