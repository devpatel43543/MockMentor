
# 🎯 MockMentor Platform

## 🧠 Overview  
MockMentor addresses a common problem: many job candidates lack adequate real-world practice and personalized feedback before interviews. Our platform simulates actual interview conditions by allowing users to respond verbally to customized questions based on specific job descriptions. The system then analyzes these spoken responses using AWS AI/ML services to provide detailed feedback on content, delivery, and presentation.

---

## ✨ Features  
- **Customized Interview Simulations** – Generate role-specific questions using AI  
- **Real-Time Speech Analysis** – Convert speech to text and evaluate delivery metrics  
- **Scalable Infrastructure** – Built on AWS for reliability and low-latency processing  
- **Actionable Feedback** – Insights on content relevance, pacing, tone, and confidence  

---

## 🙋‍♂️ User Story  
**As a** job candidate preparing for technical interviews,  
**I want** to practice answering role-specific questions verbally and receive AI-driven feedback,  
**So that** I can improve my communication skills and confidence before the actual interview.  

---

## 🗺️ Architecture Diagram  
![architecture](https://github.com/user-attachments/assets/49b77925-0b73-4327-ae97-9d4befb57913)


---

## 🏗️ Architecture Overview

### 🔐 1. Network & Security  
- **Amazon VPC** (2 AZs): Isolated network environment for secure resource deployment  
- **Application Load Balancer**: Distributes traffic across frontend and backend services  
- **AWS Secrets Manager**: Securely stores API keys and credentials  

### ⚙️ 2. Compute & Scaling  
- **Auto Scaling Groups**:  
  - **Frontend** – Hosts the React.js UI (scales based on user traffic)  
  - **Backend** – Manages API request processing and AI workflows  
- **AWS Lambda (x3)** – Serverless functions for:  
  1. Generating interview questions (via **Amazon Bedrock**)  
  2. Processing audio via **Amazon Transcribe** (speech-to-text)  
  3. Sending feedback notifications via **Amazon SNS**  

### 💾 3. Storage & Database  
- **Amazon S3** – Stores job descriptions, audio recordings, and feedback reports  
- **Amazon DynamoDB** – Manages user profiles, session history, and assessment results  

### 🔗 4. API Layer  
- **Amazon API Gateway (REST)** – Routes requests to Lambda functions and backend EC2 instances  

### 🤖 5. AI/ML Services  
- **Amazon Bedrock** – Generates tailored interview questions using LLMs  
- **Amazon Transcribe** – Converts speech responses to text for analysis  

### 📈 6. Monitoring & Alerts  
- **AWS CloudWatch** – Tracks performance metrics, logs, and triggers auto-scaling  
- **Amazon SNS** – Sends email/SMS alerts for feedback readiness and system updates  

---

## 🔄 Workflow

1. **Job Description Upload**  
   Users upload a job description or select from predefined roles. Based on this input, the system generates a customized set of interview questions.

2. **Interview Simulation**  
   The user begins a practice interview and answers questions verbally using their device’s microphone. Each response is recorded and securely uploaded for processing.

3. **Real-Time Feedback**  
   After each answer, the audio is transcribed and immediately analyzed for:  
   - Content relevance  
   - Clarity of delivery  
   - Pacing and keyword usage  

   Feedback is instantly displayed on the user’s screen to help improve performance for the upcoming questions.

4. **Session Completion & Report Generation**  
   After the final question, all response data and feedback are compiled into a comprehensive performance report.

5. **Email Report Delivery**  
   The full session report is sent to the user’s email using **Amazon SNS**, providing a summary of strengths, improvement areas, and overall progress.

---
## 🎥 Demo Video

https://github.com/user-attachments/assets/225b4faa-0e03-491b-858a-689091fdaa46

---
## 🚀 Future Enhancements  
- **Video Analysis** – Integrate Amazon Rekognition for body language feedback  
- **Multi-User Sessions** – Collaborative mock interviews using WebSocket APIs  
- **Skill-Specific Assessments** – Support for design, leadership, and non-technical roles  
