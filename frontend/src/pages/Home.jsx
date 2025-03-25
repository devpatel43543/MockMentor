import axios from "axios";
import { useState } from "react";
import { getUserIdFromToken } from "../utils/getUserIdFromToken";

const Home = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Add loading state

  // Handle file selection with validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== "text/plain") {
      alert("Please upload a valid text file.");
      return;
    }
    setFile(selectedFile);
  };

  // Handle file upload with proper error handling and logging
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a text file to upload.");
      return;
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      alert("User not authenticated. Please log in.");
      return;
    }

    try {
      setIsUploading(true); // Show loading state
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      // Optional: Log FormData contents (for debugging, since console.log(formData) is unhelpful)
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(
        "http://localhost:3000/api/jd/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Axios sets this automatically, but explicit for clarity
          },
        }
      );

      alert("JD uploaded successfully!");
      console.log("S3 URL:", response.data.s3Url);
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      alert(`Failed to upload JD: ${error.response?.data?.message || "Server error"}`);
    } finally {
      setIsUploading(false); // Reset loading state
    }
  };

  return (
    <div>
      <h2>Upload JD File</h2>
      <input
        type="file"
        accept=".txt" // Restrict to text files
        onChange={handleFileChange}
        disabled={isUploading}
      />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default Home;