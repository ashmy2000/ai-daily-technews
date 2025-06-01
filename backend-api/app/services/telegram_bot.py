import os
import requests
import httpx
from dotenv import load_dotenv
load_dotenv()


async def send_telegram_message(chat_id: int, message: str) -> bool:
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {"chat_id": chat_id, "text": message}

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload)
        print(response.status_code, response.text)
        return response.status_code == 200