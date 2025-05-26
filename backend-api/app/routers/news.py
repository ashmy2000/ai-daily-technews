### backend-api/app/routers/news.py
from fastapi import APIRouter
import json
from pathlib import Path

router = APIRouter()

@router.get("/news")
def get_mock_news():
    file_path = Path(__file__).parent.parent / "data" / "fake_news.json"
    with open(file_path, "r") as f:
        news = json.load(f)
    return {"articles": news}
