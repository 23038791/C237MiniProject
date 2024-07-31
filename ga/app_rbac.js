const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const personsRouter = require('./persons');
const accountRouter = require('./account').router;
const mysql = require('mysql2');
const { checkAuthenticated } = require('./account');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const router = express.Router();

//db connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'c237_affirm', //own database
  connectTimeout: 1000000 // 1000 seconds ~ 16 minutes
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Static Files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Template Engine
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.user ? true : false;
  res.locals.user = req.session.user || null;
  res.locals.message = req.session.message || null;
  delete req.session.message; // Clear the message after using it
  next();
});

app.get('/', (_req, res) => {
  res.render('home', { title: 'Home Page', errors: null });
});
app.use('/', accountRouter);
app.use('/', personsRouter);

// Middleware to check if user is logged in

// Middleware to check if user is admin
function checkAdmin(req, res, next) {
  if (req.session.user && req.session.user.role === 'admin') {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
}

// Routes for user registration
router.get('/register', checkAdmin, (_req, res) => {
  res.render('register', { errors: {} });
});

router.post('/register', checkAdmin, (req, res) => {
  const { username, password, role } = req.body;
  let errors = {};

  if (!username || !password || !role) {
    errors.general = 'All fields are required';
  }

  if (Object.keys(errors).length > 0) {
    return res.render('register', { errors });
  }

  const query = 'INSERT INTO User (username, password, role) VALUES (?, SHA1(?), ?)';
  db.query(query, [username, password, role], (err, _results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        errors.general = 'Username already exists';
        return res.render('register', { errors });
      } else {
        return res.status(500).send(err);
      }
    }
    res.redirect('/login');
  });
});

// Routes for user login
router.get('/login', (_req, res) => {
  res.render('login', { title: 'Login Page', errors: null });
});

router.post('/login', (req, res) => {
  const { userid, password } = req.body;
  const query = 'SELECT userId, displayName, role FROM AppUser WHERE userid = ? AND password = SHA1(?)';
  db.query(query, [userid, password], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) {
      const errors = { msg: 'Invalid username or password' };
      return res.render('login', { title: 'Login Page', errors });
    }

    const user = results[0];
    req.session.user = user;

    // Redirect to the original URL if it exists
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(returnTo);

  });
});

// Route for user logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`);
});