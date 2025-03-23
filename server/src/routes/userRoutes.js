const express = require('express');
const { registerUser, loginUser } = require('../services/userService');
const router = express.Router();

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    console.log('User registered:', user);
    res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    console.log('User Registration Error:', err);
    res.status(400).json({ error: err.message });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, userId } = await loginUser(email, password);
    res.json({ message: 'Login successful', token, userId });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;
