from pydantic import BaseModel
from typing import Optional

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
