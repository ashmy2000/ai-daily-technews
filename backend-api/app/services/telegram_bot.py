import os
import requests

def send_telegram_message(username: str, message: str):
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        raise ValueError("Missing TELEGRAM_BOT_TOKEN in .env")

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": f"@{username}",  # Must have messaged bot at least once
        "text": message,
    }

    response = requests.post(url, json=payload)
    if response.status_code != 200:
        print("Telegram Error:", response.text)
    return response.status_code == 200