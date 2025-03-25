import express from "express";
import upload from "../config/multer.js";
import jdService from "../services/jdService.js";

const router = express.Router();

// Upload JD (Text File) Route
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("File:", req.file); // Uploaded file
    console.log("UserId:", req.body.userId); // Form data

    const { userId } = req.body;
    if (!req.file || !userId) {
      return res.status(400).json({ error: "File and userId are required." });
    }

    const result = await jdService(req.file, userId);
    res.status(201).json({ message: "JD uploaded successfully", ...result });
  } catch (error) {
    console.error("Error uploading JD:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;