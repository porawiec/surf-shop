require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
// const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const User = require('./models/user');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

// reseeding new posts to database
// const seedPosts = require('./seeds')
// seedPosts();


// require routes
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const reviewsRouter = require('./routes/reviews');

const app = express();

//connect to the database
mongoose.connect('mongodb://localhost:27017/surf-shop', { 
  useNewUrlParser: true,
  useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("we're connected!");
});

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// set public assets directory
app.use(express.static('public'));

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// configure Passport and Sessions

// configuring sessions needs to occur before passport
app.use(session({
  secret: 'hang ten dude!',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

// passport.command is coming from passport
// User.command is coming from passport-local-mongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set local variables middleware
app.use(function(req, res, next){
  // req.user = {
  //     // '_id' : '5eec74a5df67b06cd5f6cd7d',
  //     // 'username' : 'paulo'
  //     // '_id' : '5ef3ff1b3c9c7da16da028c7',
  //     // 'username' : 'paulo2'
  //     '_id' : '5f07ccb451ff2f31f1353737',
  //     'username' : 'paul3'
  // }
  res.locals.currentUser = req.user;
  // set default page message
  res.locals.title = 'Surf Shop';
  // set success flash message
  res.locals.success = req.session.success || '';
  delete req.session.success;
  // set error flash message
  res.locals.error = req.session.error || '';
  delete req.session.error;
  // continue on to next function in middleware chain
  next();
});

// mount routes
app.use('/', indexRouter);
app.use('/posts', postsRouter)
app.use('/posts/:id/reviews', reviewsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});

module.exports = app;
