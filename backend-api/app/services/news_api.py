import os
import httpx
from typing import List, Dict

NEWS_API_KEY = os.getenv("NEWS_API_KEY")

async def fetch_tech_news() -> List[Dict]:
    url = "https://newsapi.org/v2/top-headlines"
    params = {
        "country": "us",
        "category": "technology",
        "pageSize": 5,
    }
    headers = {
        "Authorization": NEWS_API_KEY 
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, headers=headers)

    if response.status_code != 200:
        raise Exception("News API request failed")

    data = response.json()
    return data.get("articles", [])
