import os
import requests
from dotenv import load_dotenv
load_dotenv()

import os
import requests

CHAT_ID_STORE = {
    "DA312000": 7643223315,
}

def send_telegram_message(username_or_id, message: str):
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if not token:
        raise ValueError("Missing TELEGRAM_BOT_TOKEN in .env")

    if isinstance(username_or_id, str) and username_or_id.startswith("@"):
        chat_id = username_or_id
    elif isinstance(username_or_id, str) and username_or_id in CHAT_ID_STORE:
        chat_id = CHAT_ID_STORE[username_or_id]
    else:
        chat_id = username_or_id

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {"chat_id": chat_id, "text": message}
    response = requests.post(url, json=payload)
    print(response.status_code, response.text)
    return response.status_code == 200
