from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from app.services.background_removal_service import remove_background_service
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

class ImageURLRequest(BaseModel):
    image_url: str

@router.post("/remove-background")
def remove_background_endpoint(request: ImageURLRequest):
    try:
        output_io = remove_background_service(request.image_url)
        print('type of ', type(output_io))
        output_io.seek(0)
        return Response(content=output_io.read(), media_type="image/png")
    except Exception as e:
        logger.exception("Error in remove_background_endpoint")
        raise HTTPException(status_code=500, detail=str(e))
