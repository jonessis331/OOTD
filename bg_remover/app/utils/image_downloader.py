import io
from PIL import Image
import requests  # Ensure 'requests' is imported
import logging

logger = logging.getLogger(__name__)

def download_image(image_url: str) -> Image.Image:
    try:
        response = requests.get(image_url)
        if response.status_code != 200:
            logger.error(f"Failed to download image. Status code: {response.status_code}")
            raise Exception(f"Failed to download image. Status code: {response.status_code}")
        data = response.content
        image = Image.open(io.BytesIO(data)).convert("RGBA")
        return image
    except Exception as e:
        logger.exception(f"Error downloading image from URL: {image_url}")
        raise
