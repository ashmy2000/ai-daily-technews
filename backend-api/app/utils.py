### backend-api/app/utils.py
# Utility functions (can be expanded later)

def format_message(article: dict) -> str:
    return f"{article['title']}\n{article['summary']}\n{article['url']}"