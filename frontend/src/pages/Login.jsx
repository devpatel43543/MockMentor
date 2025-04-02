import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL
    console.log(backendUrl)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            navigate("/home");
        }
    }
    , []);
    async function onSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.target);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            const response = await axios.post(`${backendUrl}/api/users/login`, {
                email: data.email,
                password: data.password
            });

            // Assuming the backend returns { token: "jwt-token", user: {...} }
            const { token } = response.data;
            console.log('Token:', token);
            // Store token in localStorage
            localStorage.setItem('token', token);
            
            console.log('Login successful:', response.data);
            // Redirect to dashboard or home page
            // window.location.href = '/dashboard';
        
            navigate('/home');

        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message || 'Login failed';
            setError(errorMessage);
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
                {/* Left side - Brand and messaging */}
                <div className="space-y-6 p-6 hidden md:block">
                    <div className="space-y-2">
                        <div className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Interview Preparation
                        </div>
                        <h1 className="text-4xl font-bold text-slate-800">
                            <span className="text-blue-600">Prep</span>Wise
                        </h1>
                        <p className="text-xl text-slate-600 mt-2">
                            Your AI-powered interview assistant
                        </p>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
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
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-800">
                                    AI-Generated Questions
                                </h3>
                                <p className="text-slate-600 text-sm">
                                    Based on your job description
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
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
                                    <path d="M12 8c-2.8 0-5 1.8-5 4s2.2 4 5 4 5-1.8 5-4-2.2-4-5-4Z"></path>
                                    <path d="M12 16v3"></path>
                                    <path d="M12 5v3"></path>
                                    <path d="m19 9-3 2"></path>
                                    <path d="m5 9 3 2"></path>
                                    <path d="m19 15-3-2"></path>
                                    <path d="m5 15 3-2"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-800">
                                    Personalized Feedback
                                </h3>
                                <p className="text-slate-600 text-sm">
                                    Improve with each practice session
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
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
                                    <path d="M2 12h10"></path>
                                    <path d="M9 4v16"></path>
                                    <path d="M14 9h3"></path>
                                    <path d="M17 6v6"></path>
                                    <path d="M22 12h-3"></path>
                                    <path d="M19 15v3"></path>
                                    <path d="M14 18h3"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-medium text-slate-800">
                                    Detailed Analysis
                                </h3>
                                <p className="text-slate-600 text-sm">
                                    Get insights on your performance
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side - Login form */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 relative overflow-hidden">
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500 rounded-bl-full opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-500 rounded-tr-full opacity-20"></div>

                    <div className="relative">
                        <div className="text-center mb-6 space-y-2">
                            <h2 className="text-2xl font-semibold text-slate-800">
                                Welcome Back!
                            </h2>
                            <p className="text-slate-500">
                                Log in to continue your interview preparation journey
                            </p>
                        </div>

                        <div className="space-y-6">
                            <form onSubmit={onSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-slate-700"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                      focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-slate-700"
                                        >
                                            Password
                                        </label>
                                        <a
                                            href="#"
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm
                      focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-2 px-4 rounded-md text-white font-medium text-sm
                    ${isLoading
                                            ? "bg-blue-400 cursor-not-allowed"
                                            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        }`}
                                >
                                    {isLoading ? "Logging in..." : "Log in"}
                                </button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-slate-500">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    className={`flex items-center justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700
                    ${isLoading
                                            ? "bg-slate-50 cursor-not-allowed"
                                            : "bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        }`}
                                >
                                    <svg
                                        className="mr-2 h-4 w-4"
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
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                    </svg>
                                    GitHub
                                </button>
                                <button
                                    type="button"
                                    disabled={isLoading}
                                    className={`flex items-center justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700
                    ${isLoading
                                            ? "bg-slate-50 cursor-not-allowed"
                                            : "bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        }`}
                                >
                                    <svg
                                        className="mr-2 h-4 w-4"
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
                                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                                    </svg>
                                    Google
                                </button>
                            </div>

                            <div className="text-center text-sm text-slate-500 mt-6">
                                Don't have an account?{" "}
                                <a href="/register" className="text-blue-600 hover:underline">
                                    Create an account
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
