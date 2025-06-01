from fastapi import FastAPI
from app.routers import telegram, news
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from app.cron_jobs.send_daily_news import schedule_daily_news

app = FastAPI(title="AI TechNews API")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OR specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(telegram.router, prefix="/api")
app.include_router(news.router, prefix="/api")

scheduler = AsyncIOScheduler()

@app.on_event("startup")
async def start_scheduler():
    schedule_daily_news(scheduler)
    scheduler.start()