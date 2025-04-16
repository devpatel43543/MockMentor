import React, { useState, useEffect, useContext, useRef} from "react";
import QuestionContext from "../context/QuestionContext";
import RecordRTC from "recordrtc";
import { getUserIdFromToken } from "../utils/getUserIdFromToken";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const RecordAnswer = () => {
const { questions, jdID } = useContext(QuestionContext);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);
    const [isSessionComplete, setIsSessionComplete] = useState(false);
    const recorderRef = useRef(null);
    const intervalRef = useRef(null);
    const navigate = useNavigate();

    const userId = getUserIdFromToken();
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    const apiGatewayUrl = import.meta.env.VITE_API_GATEWAY_URL;

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

    };

    const startRecording = async () => {
        try {
            // Check if mediaDevices is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Media devices not supported in this browser.");
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new RecordRTC(stream, {
                type: "audio",
                recorderType: RecordRTC.StereoAudioRecorder,
                mimeType: "audio/mp3",
            });

            recorderRef.current = recorder;
            recorderRef.current.stream = stream; // Store stream for cleanup
            recorder.startRecording();
            setIsRecording(true);
            setRecordingTime(0);
            console.log("Recording started");

            intervalRef.current = setInterval(() => {
                setRecordingTime((prevTime) => prevTime + 1);
            }, 1000);
        } catch (err) {
            console.error("Error starting recording:", err);
        }
    };

    const stopRecording = () => {
        if (recorderRef.current) {
            setIsRecording(false);
            clearInterval(intervalRef.current);
            console.log("Stopping recording");

            recorderRef.current.stopRecording(() => {
                const blob = recorderRef.current.getBlob();
                console.log("Recording stopped, blob size:", blob.size);
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                // Clean up stream tracks
                if (recorderRef.current.stream) {
                    recorderRef.current.stream.getTracks().forEach((track) => track.stop());
                }
            });
        }
    };

    const submitAnswer = async () => {
        if (!audioBlob || currentQuestionIndex >= questions.length) {
            console.error("No audio blob or invalid question index");
            return;
        }

        setIsUploading(true);
        console.log("Submitting answer, uploading started");

        const question = questions[currentQuestionIndex];
        const formData = new FormData();
        formData.append("audio", audioBlob, `${userId}_${Date.now()}_${question.questionId}.mp3`);
        formData.append("userId", userId);
        formData.append("questionId", question.questionId);
        formData.append("questionText", question.questionText);

        try {
            console.log("Sending upload request to backend");
            const response = await axios.post(`${backendUrl}/recording/uploadRecording`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Upload response:", response.status, response.data);
            if (response.status !== 200) throw new Error("Upload failed");

            setAudioUrl(null);
            setAudioBlob(null);
            await fetchFeedback(question.questionId);
        } catch (err) {
            console.error("Error uploading audio:", err);
        } finally {
            setIsUploading(false);
            console.log("Uploading finished, isUploading set to false");
        }
    };

    const fetchFeedback = async (questionId) => {
        setIsFeedbackLoading(true);
        setFeedback(null);
        const fullUrl = `${apiGatewayUrl}/feedback`;
        console.log("Full URL for feedback:", fullUrl);
        console.log("User ID:", userId);
        console.log("Question ID:", questionId);
        try {
            console.log("Calling get-feedback Lambda function");
            const feedbackResponse = await axios.post(
                fullUrl,
                { userId, questionId },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Feedback response:", feedbackResponse.status, feedbackResponse.data);
            setFeedback(feedbackResponse.data.feedback);

            // If this is the last question, mark session as complete
            if (currentQuestionIndex === questions.length - 1) {
                setIsSessionComplete(true);
            }
        } catch (err) {
            console.error("Error calling feedback Lambda:", err);
        } finally {
            setIsFeedbackLoading(false);
        }
    };

    const goToNextQuestion = () => {
        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setFeedback(null);
            console.log("Moved to next question, index:", currentQuestionIndex + 1);
        }
    };

    const restartInterview = () => {
        console.log("Restarting interview, navigating to homepage");
        navigate("/home");
    };

    const requestSummaryReport = async () => {
        if (!jdID || !userId) {
            console.error("Missing jdID or userId");
            return;
        }

        const fullUrl = `${apiGatewayUrl}/interview-report`;
        console.log("Requesting summary report, URL:", fullUrl);
        try {
            const response = await axios.post(
                fullUrl,
                { jdID, userId },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Report response:", response.status, response.data);
            if (response.status === 200) {
               
                navigate("/home");
            } else {
                throw new Error("Failed to send report");
            }
        } catch (err) {
            console.error("Error sending report:", err);
        }
    };

    if (!questions?.length) return <div>No questions available</div>;

    if (isSessionComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                    {feedback && (
                        <div className="mb-6 p-4 bg-slate-100 rounded-md">
                            <h3 className="text-lg font-semibold text-slate-800">Feedback for Last Question</h3>
                            <p className="text-slate-600">{feedback}</p>
                        </div>
                    )}
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Session Completed!</h2>
                    <p className="text-slate-600 mb-6">Thank you for completing the interview session.</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={restartInterview}
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                        >
                            Restart Interview
                        </button>
                        <button
                            onClick={requestSummaryReport}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                        >
                            Get Summary Report
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const question = questions[currentQuestionIndex];
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
            <header className="bg-white border-b border-slate-200 py-4 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-bold text-slate-800">
                        <span className="text-blue-600">Prep</span>Wise
                    </h1>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-2xl">
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                        <div className="w-full bg-slate-100 h-2">
                            <div
                                className="bg-blue-600 h-2 transition-all duration-300"
                                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                            ></div>
                        </div>

                        <div className="p-8">
                            <h2 className="text-xl font-medium text-slate-800 mb-8">
                                {questions[currentQuestionIndex].questionText}
                            </h2>

                            {!isRecording && !audioBlob && !isFeedbackLoading && !feedback && (
                                <button
                                    onClick={startRecording}
                                    className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
                                    disabled={isUploading}
                                >
                                    Start Recording Your Answer
                                </button>
                            )}

                            {isRecording && (
                                <button
                                    onClick={stopRecording}
                                    className="w-full py-4 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium"
                                    disabled={isUploading}
                                >
                                    Stop Recording ({formatTime(recordingTime)})
                                </button>
                            )}

                            {audioBlob && !isRecording && !isFeedbackLoading && !feedback && (
                                <div className="space-y-4">
                                    <audio controls src={audioUrl} className="w-full" />
                                    <button
                                        onClick={submitAnswer}
                                        className="w-full py-4 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium"
                                        disabled={isUploading}
                                    >
                                        {isUploading ? "Uploading..." : "Submit Answer"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setAudioBlob(null);
                                            setAudioUrl(null);
                                        }}
                                        className="w-full py-4 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium"
                                        disabled={isUploading}
                                    >
                                        Re-record Answer
                                    </button>
                                </div>
                            )}

                            {isFeedbackLoading && (
                                <div className="flex flex-col items-center gap-2">
                                    {/* Dots loading animation */}
                                    <div className="flex space-x-3">
                                        {[0, 1, 2].map((dot) => (
                                            <div
                                                key={dot}
                                                className="w-5 h-5 rounded-full bg-blue-500"
                                                style={{
                                                    animation: `dotPulse 1.5s ease-in-out ${dot * 0.2}s infinite`,
                                                }}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-blue-700 font-medium text-lg mt-4">generating feedback...</p>
                                </div>
                            )}

                            {feedback && !isFeedbackLoading && (
                                <div className="space-y-4">
                                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                        <h3 className="text-lg font-semibold text-green-800 mb-2">Feedback</h3>
                                        <p className="text-gray-700">{feedback}</p>
                                    </div>
                                    <button
                                        onClick={goToNextQuestion}
                                        className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium"
                                    >
                                        Next Question
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <style jsx global>{`
        @keyframes dotPulse {
          0%, 100% {
            transform: scale(0.7);
            opacity: 0.5;
          }
          50% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
        </div>
    );
};

export default RecordAnswer;
