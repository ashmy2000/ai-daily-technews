from datetime import datetime
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import asyncio
from app.db.mongo import raw_updates_collection
from app.routers.news import send_news_to_user

def schedule_daily_news(scheduler: AsyncIOScheduler):
    scheduler.add_job(send_news_to_all_users, "cron", hour=7, minute=0)  # Runs every day at 7 AM

async def send_news_to_all_users():
    today = datetime.utcnow().date()

    async for user in raw_updates_collection.find({
        "subscribed": True,
        "expiry_date": {"$gte": today.isoformat()}
    }):
        chat_id = user["message"]["chat"]["id"]

        try:
            await send_news_to_user(chat_id)
            await asyncio.sleep(3)
        except Exception as e:
            print(f"Error sending news to {chat_id}: {e}")
