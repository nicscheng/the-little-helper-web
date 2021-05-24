const express = require('express');
const mongoose = require('mongoose');
// const Post = require('./models/post');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

const app = express();

require('./config/passport')(passport);

// mongoDB
//const dbURI = 'mongodb://localhost:27017/the-little-helper';
const dbURI = 'mongodb+srv://DeveloperOne:ilovepepper143@the-little-helper.9kzsf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(3000), console.log("Connection success!"))
  .catch((err) => console.log(err));

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/venobox'));
app.use(express.static(__dirname + '/webfonts'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

app.use(session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

//app.use('/', require('./routes/indexjs'));
app.use('/', require('./routes/router'));

