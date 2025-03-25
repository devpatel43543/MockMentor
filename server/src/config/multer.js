import multer from 'multer';
// Store the file in memory (useful for uploading to AWS S3)
const upload = multer({ storage: multer.memoryStorage() });

export default upload;