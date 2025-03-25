import React from "react";
import { useState,useEffect } from "react";
import { Link ,useNavigate} from "react-router-dom";
function landingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/home");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
    {/* Hero Section */}
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2 space-y-6">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
              AI-Powered Interview Prep
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight">
              Land Your Dream Job with <span className="text-blue-600">Prep</span>Wise
            </h1>
            <p className="text-lg text-slate-600">
              Simulate real interviews, get AI feedback, and build confidence before your big day.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-center shadow-sm transition-colors"
              >
                See How It Works
              </Link>
              {/* <a
                href="/demo"
                className="px-6 py-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-center border border-slate-200 shadow-sm transition-colors"
              >
                See How It Works
              </a> */}
            </div>
            {/* <p className="text-sm text-slate-500 italic">
              No credit card required • Cancel anytime
            </p> */}
          </div>
          <div className="md:w-1/2">
            <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-6 relative">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-t-xl"></div>
              <h3 className="text-xl font-medium text-slate-800 mb-3">Sample Interview Question</h3>
              <p className="text-slate-700 mb-4 pb-4 border-b border-slate-100">
                "Describe a challenging project you led and how you ensured its success despite obstacles."
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-slate-600">Record your answer</span>
                </div>
                <div className="text-slate-500 text-sm">1 of 5 questions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Social Proof
    <section className="py-8 bg-slate-50 text-center">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-slate-600">Trusted by job seekers from companies like</p>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mt-4">
          <div className="text-slate-400 font-medium text-xl">Google</div>
          <div className="text-slate-400 font-medium text-xl">Amazon</div>
          <div className="text-slate-400 font-medium text-xl">Microsoft</div>
          <div className="text-slate-400 font-medium text-xl">Meta</div>
          <div className="text-slate-400 font-medium text-xl">Apple</div>
        </div>
      </div>
    </section> */}

    {/* How It Works */}
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800">How PrepWise Works</h2>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto">
            Our AI-powered platform transforms your interview preparation in just three simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl p-6 text-center space-y-4">
            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Upload Job Description</h3>
            <p className="text-slate-600">
              Our AI analyzes the job description to identify the key skills and experiences the interviewer will be looking for.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center space-y-4">
            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Record Your Answers</h3>
            <p className="text-slate-600">
              Practice answering tailored questions in a simulated interview environment that mimics real pressure.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 text-center space-y-4">
            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-800">Get Expert Feedback</h3>
            <p className="text-slate-600">
              Receive personalized feedback on each answer and a comprehensive analysis of your overall performance.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Key Benefits */}
    <section className="py-20 bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex items-center gap-12">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">Why Job Seekers Love PrepWise</h2>
            
            <div className="space-y-5">
              <div className="flex gap-3">
                <div className="text-green-500 flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <p className="text-slate-700"><span className="font-medium">Job-specific questions</span> tailored to the exact role you're applying for</p>
              </div>
              
              <div className="flex gap-3">
                <div className="text-green-500 flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <p className="text-slate-700"><span className="font-medium">Immediate, actionable feedback</span> to improve your responses</p>
              </div>
              
              <div className="flex gap-3">
                <div className="text-green-500 flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <p className="text-slate-700"><span className="font-medium">Practice under pressure</span> in a realistic interview environment</p>
              </div>
              
              <div className="flex gap-3">
                <div className="text-green-500 flex-shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <p className="text-slate-700"><span className="font-medium">Comprehensive analysis</span> showing your strengths and areas for improvement</p>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <div className="mb-4 pb-4 border-b border-slate-100">
                <div className="text-blue-600 font-bold text-4xl">92%</div>
                <div className="text-slate-700 font-medium">Users report improved interview performance</div>
              </div>
              <div className="mb-4 pb-4 border-b border-slate-100">
                <div className="text-blue-600 font-bold text-4xl">100%</div>
                <div className="text-slate-700 font-medium">Tailored questions per job description</div>
              </div>
              <div>
                <div className="text-blue-600 font-bold text-4xl">24h</div>
                <div className="text-slate-700 font-medium">Is all you need to transform your interview skills</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Testimonial */}
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="text-blue-600 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>
        <blockquote className="text-2xl italic font-medium text-slate-700 mb-8">
          "I was getting rejected after every interview until I found PrepWise. The targeted questions and feedback were exactly what I needed. Just got an offer from my top choice company!"
        </blockquote>
        <div className="font-medium text-slate-800">Sarah K.</div>
        <div className="text-slate-600">Software Engineer at Google</div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to ace your next interview?</h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of job seekers who landed their dream jobs after preparing with PrepWise.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/register"
            className="px-8 py-3 rounded-lg bg-white text-blue-700 font-bold text-center hover:bg-blue-50 transition-colors shadow-sm"
          >
            Get Started Free
          </a>
          <a
            href="/login"
            className="px-8 py-3 rounded-lg bg-blue-500/30 hover:bg-blue-500/40 text-white font-medium text-center transition-colors"
          >
            Log In
          </a>
        </div>
        <p className="text-sm text-blue-200 mt-4">
          No credit card required • Free plan available
        </p>
      </div>
    </section>

    {/* Footer */}
    <footer className="py-12 bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-white">
              <span className="text-blue-400">Prep</span>Wise
            </h2>
            <p className="mt-2">Your AI-powered interview assistant</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">Blog</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm">
          &copy; {new Date().getFullYear()} PrepWise. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
  );
}
export default landingPage;