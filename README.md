# 🚀 NarcScan - AI-Powered Drug Sale Detection System

![NarcScan Screenshot](frontend/assets/screenshot.png)

NarcScan is an **experimental AI-powered system** that detects potentially illicit drug-related conversations.  
This repository contains a full-stack demo setup with a **placeholder keyword-based model** (easy to replace with your own trained ML model).

---

## ✨ Features
- 🧠 **NLP-based detection** (placeholder keyword matcher)
- 🔗 **Flask API backend** with CORS
- 🌐 **Node.js proxy server** (Express + Axios)
- 💻 **Frontend** built with TailwindCSS
- 📂 **Clean project structure** ready for collaboration

---

## 🛠️ Technologies
- **Backend**: Python 3, Flask  
- **Machine Learning**: scikit-learn (placeholder)  
- **Frontend**: HTML, TailwindCSS, Vanilla JS  
- **Server**: Node.js, Express, Axios  

---

## 📂 Project Structure
NarcScan/
├── backend/
│ ├── api.py # Flask API
│ ├── drug_detection_model.py # Placeholder detection model
│ └── requirements.txt
├── frontend/
│ ├── index.html
│ ├── css/
│ ├── js/
│ └── assets/
├── server/
│ ├── server.js
│ └── package.json
├── README.md
├── LICENSE
└── .gitignore
---

## ⚙️ Installation & Setup

### 1️⃣ Backend (Flask API)
```bash
cd backend
python -m venv .venv
# Windows PowerShell
. .venv\Scripts\Activate.ps1
# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
python api.py
➡️ Flask runs on http://localhost:5000

2️⃣ Server (Node.js proxy)
cd server
npm install
npm start


➡️ Express serves the frontend at http://localhost:3000
➡️ All /api/* requests are proxied to Flask.

3️⃣ Frontend

Visit: http://localhost:3000

Type/paste a message and click Analyze.

🧪 Example Usage

Input:

Got some weed and molly, hmu for prices


Output:

{
  "label": "suspicious",
  "confidence": 0.7,
  "matches": ["weed", "molly", "hmu"]
}
