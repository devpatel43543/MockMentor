const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const jdRoutes = require('./routes/jdRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/jd', jdRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

module.exports = app; // Export for testing purposes