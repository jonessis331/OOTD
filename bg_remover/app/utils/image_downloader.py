import io
from PIL import Image
import aiohttp

async def download_image(image_url: str) -> Image.Image:
    async with aiohttp.ClientSession() as session:
        async with session.get(image_url) as response:
            if response.status != 200:
                raise Exception(f"Failed to download image. Status code: {response.status}")
            data = await response.read()
            image = Image.open(io.BytesIO(data)).convert("RGBA")
            return image
