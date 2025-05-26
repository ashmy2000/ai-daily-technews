import os
from motor.motor_asyncio import AsyncIOMotorClient

mongo_uri = os.getenv("MONGODB_URI")
client = AsyncIOMotorClient(mongo_uri)
db = client["ai_technews"]
raw_updates_collection = db["raw_updates"]
users_collection = db["subscribers"]          # for registered users
telegram_users_collection = db["telegram_users"]  # for OTP, status, expiry, etc.

