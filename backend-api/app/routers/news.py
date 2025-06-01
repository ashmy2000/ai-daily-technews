from fastapi import APIRouter
import json
from pathlib import Path
import asyncio

from app.services.telegram_bot import send_telegram_message
from app.utils import format_message
from app.services.news_api import fetch_tech_news
from app.services.fake_news_detector import detect_fake_news

router = APIRouter()

async def send_news_to_user(chat_id: int):
    try:
        # ✅ Fetch real tech news
        articles = await fetch_tech_news()

        for article in articles:
            message = format_message(article)
            await send_telegram_message(chat_id, message)
            await asyncio.sleep(3) 

    except Exception as e:
        print("🔁 Fallback: Sending mock news due to error:", e)

        # ⛔ Fallback to local mock news if real API fails
        file_path = Path(__file__).parent.parent / "data" / "fake_news.json"
        with open(file_path, "r") as f:
            mock_articles = json.load(f)

        for article in mock_articles:
            message = format_message(article)
            await send_telegram_message(chat_id, message)

        await send_telegram_message(chat_id, "❌ Real news failed. You're seeing mock news instead.")

# async def send_news_to_user(chat_id: int):
#     try:
#         articles = await fetch_tech_news()

#         for article in articles:
#             is_real = await detect_fake_news(article)
#             message = format_message(article)

#             if not is_real:
#                 message = f"⚠️ Warning: This might be fake news!\n\n{message}"

#             await send_telegram_message(chat_id, message)

#     except Exception as e:
#         print("🔁 Fallback: Sending mock news due to error:", e)
#         file_path = Path(__file__).parent.parent / "data" / "fake_news.json"
#         with open(file_path, "r") as f:
#             mock_articles = json.load(f)

#         for article in mock_articles:
#             message = format_message(article)
#             await send_telegram_message(chat_id, message)

#         await send_telegram_message(chat_id, "TOKEN RAN OUT\nSorry, please wait until tomorrow to get more news.")

