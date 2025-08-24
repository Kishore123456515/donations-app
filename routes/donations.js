const express = require('express');
const router = express.Router();

// Middleware to check if user is logged in
const requireAuth = (req, res, next) => {
  const userId = req.cookies.userId;
  const user = global.users.find(user => user.id === userId);
  
  if (!user) {
    return res.redirect('/auth/login');
  }
  
  req.user = user;
  next();
};

// Handle donation
router.post('/:causeId', requireAuth, (req, res) => {
  const { amount } = req.body;
  const causeId = req.params.causeId;
  
  const cause = global.causes.find(c => c.id === causeId);
  
  if (!cause) {
    return res.status(404).render('error', { 
      title: 'Not Found',
      message: 'Cause not found' 
    });
  }
  
  const donation = {
    id: Date.now().toString(),
    amount: parseFloat(amount),
    donorId: req.user.id,
    donorName: req.user.name,
    causeId,
    causeTitle: cause.title,
    createdAt: new Date()
  };
  
  global.donations.push(donation);
  
  // Update cause current amount
  cause.currentAmount += donation.amount;
  cause.donations.push(donation);
  
  res.redirect(`/causes/${causeId}`);
});

// View user donations
router.get('/', requireAuth, (req, res) => {
  const userDonations = global.donations.filter(d => d.donorId === req.user.id);
  
  res.render('my-donations', { 
    title: 'My Donations',
    donations: userDonations 
  });
});

module.exports = router;