const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('causes', { 
    title: 'All Causes',
    causes: global.causes || []
  });
});

module.exports = router;