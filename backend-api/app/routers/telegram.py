
### backend-api/app/routers/telegram.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.otp_service import generate_otp, verify_otp
from app.services.telegram_bot import send_telegram_message

router = APIRouter()

otp_store = {}  # In-memory store for testing

class OTPRequest(BaseModel):
    username: str

class OTPVerify(BaseModel):
    username: str
    code: str

class SubscriptionRequest(BaseModel):
    username: str
    expiry_date: Optional[str] = None

@router.post("/send-otp")
def send_otp(data: OTPRequest):
    code = generate_otp()
    otp_store[data.username] = code
    send_telegram_message(data.username, f"Your verification code is: {code}")
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
    return {"message": "Subscription confirmed"}