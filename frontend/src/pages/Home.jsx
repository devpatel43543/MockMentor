import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import { getUserIdFromToken } from "../utils/getUserIdFromToken";
import { showErrorToast, showSuccessToast } from "../utils/Toast";
import { ToastContainer } from "react-toastify";
import QuestionContext from "../context/QuestionContext";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef(null);
  const [jdID, setJdID] = useState("");
  const [s3Url, setS3Url] = useState("");
  const [userId, setUserId] = useState("");
  const { questions, setQuestions } = useContext(QuestionContext);

     const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    console.log(backendUrl)
  // Handle file selection with validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== "text/plain") {
      alert("Please upload a valid text file.");
      return;
    }
    setFile(selectedFile);
    setIsUploaded(false);
  };

  // Handle file upload
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
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      const response = await axios.post(
        `${backendUrl}/api/jd/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showSuccessToast("JD uploaded successfully");
      setJdID(response.data.jdId);
      setS3Url(response.data.s3Url);
      setIsUploaded(true);
    } catch (error) {
      showErrorToast(
        `Failed to upload JD: ${error.response?.data?.message || "Server error"}`
      );
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Fetch questions from DynamoDB
  const fetchQuestionsFromDynamoDB = async (jdId) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/questions?jdId=${jdId}`
      );
      if (response.status === 200) {
        console.log("Fetched questions:", response.data);
        return response.data.questions; // Ensure the response returns an array
      } else {
        throw new Error("Failed to fetch questions from DynamoDB");
      }
    } catch (error) {
      console.error("Error fetching questions from DynamoDB:", error);
      showErrorToast("Failed to fetch questions from database");
      return [];
    }
  };
  

  // Start interview and fetch questions
  const handleStartInterview = async () => {
    if (!isUploaded) return;
    setIsUploading(true);

    try {
      // Call Lambda to trigger question generation (optional if required)
      await axios.post(
        "https://mo1qwudxgb.execute-api.us-east-1.amazonaws.com/dev/generate-questions",
        { jdId: jdID, s3Url: s3Url }
      );

      // Fetch questions from DynamoDB
      const questionsFromDB = await fetchQuestionsFromDynamoDB(jdID);

      if (questionsFromDB.length > 0) {
        setQuestions(questionsFromDB);
        navigate("/interview");
        showSuccessToast("Interview started successfully");
      } else {
        showErrorToast("No questions found for the provided JD ID");
      }
    } catch (error) {
      console.error("Interview start error:", error);
      showErrorToast(
        `Failed to start interview: ${
          error.response?.data?.message || "Server error"
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      <ToastContainer />
      <header className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">
            <span className="text-blue-600">Prep</span>Wise
          </h1>

          <div className="flex items-center space-x-4">
            <button className="text-slate-600 hover:text-slate-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                  Interview Preparation
                </h2>
                <p className="text-slate-600">
                  Upload your job description (JD) to start your interview
                  preparation
                </p>
              </div>

              <div className="space-y-6">
                {/* File Upload */}
                <div className="relative">
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file
                        ? "border-green-400 bg-green-50"
                        : "border-slate-300 hover:border-blue-400"
                      }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".txt"
                      className="hidden"
                    />

                    {file ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        </div>
                        <p className="text-slate-800 font-medium">
                          {file.name}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                        <button
                          onClick={() => setFile(null)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Change file
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                            <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
                            <path d="M12 11v6"></path>
                            <path d="M9 14h6"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="text-slate-800 font-medium mb-1">
                            Upload your job description
                          </p>
                          <p className="text-slate-500 text-sm mb-4">
                            TXT files only
                          </p>
                        </div>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-100 transition-colors"
                        >
                          Select File
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Conditional Button */}
                <button
                  onClick={isUploaded ? handleStartInterview : handleUpload}
                  disabled={!file || isUploading}
                  className={`w-full py-3 px-4 rounded-xl font-medium text-white transition-colors ${!file || isUploading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                    }`}
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {isUploaded ? "Starting..." : "Uploading..."}
                    </span>
                  ) : isUploaded ? (
                    "Start Interview"
                  ) : (
                    "Upload JD"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}