const express = require('express');
const router = express.Router();

// Hardcoded admin credentials
const ADMIN_USER = 'Z2A';
const ADMIN_PASS = '1234';

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;
