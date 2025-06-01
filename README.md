# Tech News On Telegram

TechInsight is a full-stack application that delivers **daily AI-curated tech news** directly to users on Telegram. Users can start the bot, verify their identity with an OTP, and subscribe with or without an expiry date. The frontend is built with React + TailwindCSS and the backend with FastAPI and MongoDB.


## Features
- Connect user's Telegram username
- Receive a real 4-digit OTP for verification to user's telegram
- Choose subscription duration
- Get daily tech news to user's telegram
- Cancel subscriptions anytime
- User's detailed saved in mongodb

##  Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: FastAPI, Python, Motor (Async MongoDB), Uvicorn
- **Database**: MongoDB Atlas (Cloud-hosted)
- **Deployment**: Render (Frontend + Backend)


## Who This Is For

This project is beginner-friendly and ideal for:
- New developers exploring full-stack projects
- Anyone learning backend + frontend integration
- Those interested in real-world Telegram bot usage

## Prerequisites (Step-by-Step)

If you're new, follow these steps before running the project.

- Install VS Code (Code Editor)
  - Download from: https://code.visualstudio.com/

- Install Git.  
  - Download from: https://git-scm.com/

- Install Python (3.10+ recommended)
  - Download from: https://www.python.org/downloads/



## Setup

1. Create a folder for your project
2. Open VS Code and open the folder
3. Open the in-built terminal in VS Code
4. Run the below commands one by one
   
Clone my git project in your VS Terminal to bring it into your local machine
```bash
git clone https://github.com/ashmy2000/ai-daily-technews.git
```
Since this is a monorepo we have the backend and frontend under the same repo. 
<br>So we will have to move into each one seperatly to run the server
<br>Let's start from the backend first:
1. Add .env file and these fields
- TELEGRAM_BOT_TOKEN=
- MONGODB_URI=
```bash
cd ai-technews
cd backend-api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
The open http://127.0.0.1:8000/docs to check the swagger and endpoints
<br><br>Now let's go into the frontend and start the UI 
1. Add .env file and these fields
- VITE_ACCESS_CODE=xxxx
- VITE_API_BASE_URL=http://127.0.0.1:8000/api
```bash
cd ..
cd frontend-ui
npm install
npm run dev
```
Open http://localhost:5173/ and you should see the UI which is connected to the backend. 

<br>

# Thank you!
Hope this help. :) 