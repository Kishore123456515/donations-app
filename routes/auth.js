const express = require('express');
const router = express.Router();

// Register page
router.get('/register', (req, res) => {
  res.render('register', { title: 'Register' });
});

// Login page
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Register handler
router.post('/register', (req, res) => {
  const { name, email, password, userType } = req.body;
  
  // Check if user already exists
  if (global.users.find(user => user.email === email)) {
    return res.render('register', { 
      title: 'Register',
      error: 'User with this email already exists' 
    });
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, // In a real app, you would hash this
    userType: userType || 'donor',
    createdAt: new Date()
  };
  
  global.users.push(newUser);
  
  // Set user cookie
  res.cookie('userId', newUser.id, { maxAge: 900000, httpOnly: true });
  res.redirect('/');
});

// Login handler
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user
  const user = global.users.find(user => user.email === email && user.password === password);
  
  if (!user) {
    return res.render('login', { 
      title: 'Login',
      error: 'Invalid email or password' 
    });
  }
  
  // Set user cookie
  res.cookie('userId', user.id, { maxAge: 900000, httpOnly: true });
  res.redirect('/');
});

// Logout handler
router.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect('/');
});

module.exports = router;