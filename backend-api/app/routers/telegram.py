
### backend-api/app/routers/telegram.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import requests
from app.services.otp_service import generate_otp, verify_otp
from app.services.telegram_bot import send_telegram_message
from app.routers.news import send_mock_news_to_user  # ADD THIS at the top
from datetime import datetime
from app.db.mongo import users_collection  # Ensure you have a database module to import this


router = APIRouter()

otp_store = {}  # In-memory store for testing


class StartRequest(BaseModel):
    username: str
    chat_id: int


class OTPRequest(BaseModel):
    username: str

class OTPVerify(BaseModel):
    username: str
    code: str

class SubscriptionRequest(BaseModel):
    username: str
    expiry_date: Optional[str] = None

from typing import Optional

def get_chat_id_from_username(username: str) -> Optional[int]:

    token = os.getenv("TELEGRAM_BOT_TOKEN")
    url = f"https://api.telegram.org/bot{token}/getUpdates"

    response = requests.get(url)
    if response.status_code != 200:
        print("Error fetching updates:", response.text)
        return None

    updates = response.json().get("result", [])
    for update in updates:
        msg = update.get("message", {})
        chat = msg.get("chat", {})
        if chat.get("username") == username:
            return chat.get("id")  # <- This is the real chat_id

    return None  # Not found

@router.post("/send-otp")
def send_otp(data: OTPRequest):
    chat_id = get_chat_id_from_username(data.username)
    if not chat_id:
        raise HTTPException(status_code=404, detail="User not found. Please make sure they've started the bot.")

    code = generate_otp()
    otp_store[data.username] = code
    send_telegram_message(chat_id, f"Your verification code is: {code}")
    return {"message": "OTP sent"}


@router.post("/verify-otp")
def verify_user_otp(data: OTPVerify):
    if data.username not in otp_store or not verify_otp(otp_store[data.username], data.code):
        raise HTTPException(status_code=400, detail="Invalid OTP")
    del otp_store[data.username]
    return {"message": "OTP verified"}

@router.post("/subscribe")
def subscribe(data: SubscriptionRequest):
    expiry_text = f"until {data.expiry_date}" if data.expiry_date else "with no expiry"
    send_telegram_message(data.username, f"✅ Thanks for subscribing to AI TechNews {expiry_text}!")
    send_mock_news_to_user(data.username)  # 💡 Send news from mock JSON
    return {"message": "Subscription confirmed"}

@router.post("/register")
async def register_user(data: StartRequest):
    try:
        await users_collection.insert_one({
            "username": data.username,
            "chat_id": data.chat_id
        })
        send_telegram_message(data.chat_id, f"👋 Hi @{data.username}, you've been registered for TechNews.")
        return {"message": "User registered"}
    except Exception as e:
        print("❌ ERROR:", e)  # 👈 This will show you the error in the terminal
        raise HTTPException(status_code=500, detail="Registration failed")

from app.services.telegram_bot import send_telegram_message

class CancelRequest(BaseModel):
    username: str

@router.post("/cancel")
async def cancel_subscription(data: CancelRequest):
    # Try to find the user
    user = await users_collection.find_one({"username": data.username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete the user
    await users_collection.delete_one({"username": data.username})

    # Send Telegram notification
    send_telegram_message(user["chat_id"], f"👋 Hi @{data.username}, your Tech News subscription has been cancelled. You can rejoin anytime!")

    return {"message": "Subscription cancelled and user notified"}

