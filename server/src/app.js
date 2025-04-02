import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import jdRoutes from './routes/jdRoutes.js';
import cors from 'cors';
import getQuestions from './routes/getQuestions.js';
import recordingRoutes from './routes/recordingRoutes.js';
dotenv.config();

const app = express();
app.use(cors({
  origin: '*', // Allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));
// Middleware
app.use(express.json());


app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is healthy!' });
});


// Routes
app.use('/api/users', userRoutes);
app.use('/api/jd', jdRoutes);
app.use("/api", getQuestions);
app.use("/recording", recordingRoutes);
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server is running :${PORT}`);
});

export default app;