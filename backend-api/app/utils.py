### backend-api/app/utils.py
# Utility functions (can be expanded later)

# app/utils.py

def format_message(article: dict) -> str:
    title = article.get("title", "No title")
    description = article.get("description", "No description")
    url = article.get("url", "No URL")
    source = article.get("source", {}).get("name", "Unknown Source")

    return f"📰 *{title}*\n\n{description}\n\n🔗 {url}\n🗞 Source: {source}"
