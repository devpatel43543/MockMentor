import express from 'express';
import multer from 'multer';
import recordingService from '../services/recordingService.js'; 

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/uploadRecording', upload.single('audio'), async (req, res) => {
  try {
    const { userId, questionId, questionText } = req.body;
    const audioFile = req.file;

    if (!audioFile || !userId || !questionId || !questionText) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await recordingService.uploadRecording({ 
      audioFile,
      userId,
      questionId,
      questionText
    });

    res.status(200).json({
      message: 'Recording uploaded successfully',
      recordingUrl: result.recordingUrl
    });
  } catch (error) {
    console.error('Error in uploadRecording route:', error);
    res.status(500).json({ error: 'Failed to process recording' });
  }
});

export default router;
