const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//helpers with some functions
const helpers = require('./helpers');
// conect to db
const db = require('./config/db');
//import model
require('./models/Projects');
require('./models/Tasks');
require('./models/Users');

db.sync()
    .then(() => console.log('conected to db'))
    .catch(error => console.log(error))
const app = express();
//enable pug
app.set('view engine', 'pug');
//load the static folder
app.use(express.static('public'));
//enable body parser to read form data
app.use(bodyParser.urlencoded({ extended: true }));
//express validator 
console.log(expressValidator);
//add view folder
app.set('views', path.join(__dirname, './views'));
//add flash messages
app.use(flash());
app.use(cookieParser());
//sessions allow us to navigate the page without re-authenticating
app.use(session({
    secret: 'supersecret',
    resave:false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
//add vardump to the app
app.use((req, res, next)=>{
    res.locals.vardump = helpers.vardump;
    res.locals.messages = req.flash();
    res.locals.user = {...req.user} || null;
    next();
})

app.use('/', routes())
app.listen(3000);
//require('./handler/email');