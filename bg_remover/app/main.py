from fastapi import FastAPI
from app.routers import background_removal
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Background Removal API",
    description="An API to remove backgrounds from images given a URL",
    version="1.0.0",
    debug=True,  # Enable debug mode
)

# Allow all origins (not recommended for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(background_removal.router)
