import io
from rembg import remove
from PIL import Image
from app.utils.image_downloader import download_image

async def remove_background_service(image_url: str):
    image = await download_image(image_url)
    output = remove(image)
    output_io = io.BytesIO()
    output.save(output_io, format='PNG')
    output_io.seek(0)
    return output_io
