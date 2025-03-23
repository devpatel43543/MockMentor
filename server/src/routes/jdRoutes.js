const express = require('express');
const { uploadJD } = require('../services/jdService');
const router = express.Router();

// POST /api/jd/upload - Upload a job description
router.post('/upload', async (req, res) => {
  try {
    const { userId, jdText } = req.body;
    if (!userId || !jdText) {
      return res.status(400).json({ error: 'User ID and JD text are required' });
    }

    const jd = await uploadJD(userId, jdText);
    res.status(201).json({ message: 'JD uploaded successfully', jd });
  } catch (err) {
    console.error('JD Upload Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
