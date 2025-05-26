import os
from motor.motor_asyncio import AsyncIOMotorClient

mongo_uri = os.getenv("MONGODB_URI")
client = AsyncIOMotorClient(mongo_uri)
db = client["ai_technews"]
users_collection = db["subscribers"]
