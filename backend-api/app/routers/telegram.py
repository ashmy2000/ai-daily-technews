from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import httpx
from app.services.otp_service import generate_otp, verify_otp
from app.services.telegram_bot import send_telegram_message
from app.routers.news import send_mock_news_to_user
from datetime import datetime, timedelta
from app.db.mongo import telegram_users_collection, users_collection, raw_updates_collection

router = APIRouter()

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

class CancelRequest(BaseModel):
    username: str

async def get_chat_id_from_username(username: str) -> Optional[int]:
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    url = f"https://api.telegram.org/bot{token}/getUpdates"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    if response.status_code != 200:
        print("Error fetching updates:", response.text)
        return None

    updates = response.json().get("result", [])
    for update in reversed(updates):
        msg = update.get("message", {})
        chat = msg.get("chat", {})
        if chat.get("username") == username:
            return chat.get("id")
    return None

# backend-api/app/routers/telegram.py

from app.db.mongo import raw_updates_collection, telegram_users_collection


@router.post("/send-otp")
async def send_otp(data: OTPRequest):
    username = data.username.strip()

    # 1. Find user's message in raw_updates
    user_record = await raw_updates_collection.find_one({
        "message.chat.username": username
    }, sort=[("message.date", -1)])  # get latest

    if not user_record:
        raise HTTPException(status_code=404, detail="User not found. Start the bot.")

    try:
        chat_id = user_record["message"]["chat"]["id"]
        code = generate_otp()
        expires_at = datetime.utcnow() + timedelta(minutes=5)

        # 2. Update the same raw_updates doc
        await raw_updates_collection.update_one(
            {"_id": user_record["_id"]},
            {"$set": {
                "otp_code": code,
                "otp_expires_at": expires_at,
                "subscribed": False
            }}
        )

        # 3. Send OTP to Telegram
        await send_telegram_message(chat_id, f"🔐 Your TechInsight OTP is: {code}")
        return {"message": "OTP sent"}

    except Exception as e:
        import traceback
        print("❌ send-otp error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail="Something went wrong while sending OTP.")



@router.post("/verify-otp")
async def verify_user_otp(data: OTPVerify):
    username = data.username.strip()

    # Step 1: Find the user in raw_updates
    user_record = await raw_updates_collection.find_one({
        "message.chat.username": username
    })

    if not user_record:
        raise HTTPException(status_code=404, detail="User not found")

    # Step 2: Get the saved OTP and expiry
    stored_code = user_record.get("otp_code")
    expires_at = user_record.get("otp_expires_at")

    if not stored_code or not expires_at:
        raise HTTPException(status_code=400, detail="No OTP found. Please request a new one.")

    # Step 3: Compare OTP
    if stored_code != data.code:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if datetime.utcnow() > expires_at:
        raise HTTPException(status_code=400, detail="OTP expired")

    return {"message": "OTP verified"}


from app.routers.news import send_mock_news_to_user
import asyncio

@router.post("/subscribe")
async def subscribe(data: SubscriptionRequest):
    username = data.username.strip()
    
    user = await raw_updates_collection.find_one({
        "message.chat.username": username
    })

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    chat_id = user["message"]["chat"]["id"]

    await raw_updates_collection.update_one(
        {"message.chat.username": username},
        {"$set": {
            "subscribed": True,
            "expiry_date": data.expiry_date
        }}
    )

    send_telegram_message(chat_id, "🎉 Subscribed! You'll get daily tech news.")

    # Delay and then send mock news
    await asyncio.sleep(5)
    send_mock_news_to_user(chat_id)  # ✅ Pass chat_id not username

    return {"message": "Subscription successful"}


@router.post("/cancel")
async def cancel(data: CancelRequest):
    username = data.username.strip()

    # Step 1: Update `subscribed` flag in raw_updates
    result = await raw_updates_collection.update_one(
        {"message.chat.username": username},
        {"$set": {"subscribed": False}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found in raw_updates.")

    # Step 2: Fetch chat_id for notification
    user_record = await raw_updates_collection.find_one({
        "message.chat.username": username
    })

    chat_id = user_record["message"]["chat"]["id"]

    # Step 3: Send Telegram message
    send_telegram_message(chat_id, "❌ Your TechInsight subscription has been cancelled.")

    return {"message": "Subscription cancelled"}


@router.post("/fetch-and-save-updates")
async def fetch_and_store_telegram_updates():
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    url = f"https://api.telegram.org/bot{token}/getUpdates"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch Telegram updates")

    updates = response.json().get("result", [])

    inserted_count = 0

    for update in updates:
        message = update.get("message", {})
        chat = message.get("chat", {})

        username = chat.get("username")
        if username:
            # ✅ Upsert by username
            await raw_updates_collection.update_one(
                {"message.chat.username": username},
                {"$set": update},
                upsert=True
            )
            inserted_count += 1

    return {"message": f"{inserted_count} updates stored/updated by username."}


@router.get("/check-user-exists")
async def check_user_exists(username: str):
    user = await raw_updates_collection.find_one({
        "message.chat.username": username.strip()
    })

    if not user:
        raise HTTPException(status_code=404, detail="User not found. Start the bot.")
    
    return {"message": "User exists"}
