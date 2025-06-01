from openai import AsyncOpenAI
import os

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def detect_fake_news(article: dict) -> bool:
    content = article.get("title", "") + "\n" + article.get("description", "")

    prompt = f"""
    Determine if the following news article is real or fake. Respond with only "True" or "False".

    Article:
    {content}
    """

    response = await client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1,
        temperature=0
    )

    return "True" in response.choices[0].message.content