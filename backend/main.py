from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from config import settings
from routes.auth import router as auth_router
from routes.face import router as face_router
from routes.audio import router as audio_router
from routes.text import router as text_router
from routes.analytics import router as analytics_router
from routes.admin import router as admin_router
from routes.fusion import router as fusion_router
from database import connect_db, close_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_db()
    print(f"{settings.APP_NAME} v{settings.APP_VERSION} starting...")
    print(f"Server running on {settings.HOST}:{settings.PORT}")
    yield
    # Shutdown
    await close_db()
    print("Server shutting down...")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered multimodal emotion detection platform",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(face_router, prefix="/api/v1/detect", tags=["Face Detection"])
app.include_router(audio_router, prefix="/api/v1/detect", tags=["Audio Detection"])
app.include_router(text_router, prefix="/api/v1/detect", tags=["Text Detection"])
app.include_router(fusion_router, prefix="/api/v1/detect", tags=["Fusion"])
app.include_router(analytics_router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["Admin"])

@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
        "docs": "/docs",
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
