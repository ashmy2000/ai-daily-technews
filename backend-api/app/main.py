from fastapi import FastAPI
from app.routers import telegram, news
from fastapi.middleware.cors import CORSMiddleware

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
