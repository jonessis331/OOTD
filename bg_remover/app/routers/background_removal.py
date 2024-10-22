from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.background_removal_service import remove_background_service

router = APIRouter()

class ImageURLRequest(BaseModel):
    image_url: str

@router.post("/remove-background")
async def remove_background_endpoint(request: ImageURLRequest):
    try:
        output_io = await remove_background_service(request.image_url)
        return StreamingResponse(output_io, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
