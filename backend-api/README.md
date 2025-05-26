### backend-api/README.md
# AI TechNews Backend (Mock API)

This backend handles OTP validation and subscription flow for Telegram users.

## Endpoints

- `POST /api/send-otp`: Send a mock OTP to a Telegram username
- `POST /api/verify-otp`: Validate the submitted OTP
- `POST /api/subscribe`: Send a thank-you message to the Telegram user
- `GET /api/news`: Get static mock tech news

## Setup

```bash
cd backend-api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Visit: [http://localhost:8000/docs](http://localhost:8000/docs) to test endpoints