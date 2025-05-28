### backend-api/app/routers/news.py
from fastapi import APIRouter
import json
from pathlib import Path
from app.services.telegram_bot import send_telegram_message
from app.utils import format_message
router = APIRouter()

@router.get("/news", include_in_schema=False)
def get_mock_news():
    file_path = Path(__file__).parent.parent / "data" / "fake_news.json"
    with open(file_path, "r") as f:
        news = json.load(f)
    return {"articles": news}

def send_mock_news_to_user(chat_id: int):
    file_path = Path(__file__).parent.parent / "data" / "fake_news.json"
    with open(file_path, "r") as f:
        articles = json.load(f)

    for article in articles:
        message = format_message(article)
        send_telegram_message(chat_id, message)
