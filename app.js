const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// In-memory data storage (for demo purposes)
global.users = [];
global.causes = [];
global.donations = [];

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make user data available to templates
app.use((req, res, next) => {
  const userId = req.cookies.userId;
  res.locals.currentUser = global.users.find(user => user.id === userId) || null;
  next();
});

// Routes
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const causeRouter = require('./routes/causes');
const donationRouter = require('./routes/donations');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/causes', causeRouter);
app.use('/donations', donationRouter);

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;