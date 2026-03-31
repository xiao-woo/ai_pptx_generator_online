import httpx
from typing import Optional, List
from app.config import settings

class ImageService:
    """图片生成服务，支持网络图片和 SVG 矢量图"""

    def __init__(self):
        self.unsplash_access_key = settings.unsplash_access_key

    async def search_images(self, query: str, count: int = 3) -> List[str]:
        """从 Unsplash 搜索图片"""
        if not self.unsplash_access_key:
            # 如果没有 API key，返回占位图
            return [
                "https://via.placeholder.com/400x300?text=Image+1",
                "https://via.placeholder.com/400x300?text=Image+2",
                "https://via.placeholder.com/400x300?text=Image+3",
            ]

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://api.unsplash.com/search/photos",
                    params={
                        "query": query,
                        "per_page": count,
                        "orientation": "landscape"
                    },
                    headers={
                        "Authorization": f"Client-ID {self.unsplash_access_key}"
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                return [photo["urls"]["regular"] for photo in data["results"]]
        except Exception as e:
            print(f"Failed to search images: {e}")
            return []

    async def generate_svg(self, text: str, color: str = "#4A90E2") -> str:
        """生成简单的 SVG 图表"""
        svg_content = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#f5f5f5"/>
  <text x="200" y="150" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="{color}">
    {text}
  </text>
  <circle cx="100" cy="200" r="30" fill="{color}" opacity="0.8"/>
  <circle cx="200" cy="200" r="40" fill="{color}" opacity="0.6"/>
  <circle cx="300" cy="200" r="35" fill="{color}" opacity="0.7"/>
</svg>"""
        # 返回 data URL
        import base64
        encoded = base64.b64encode(svg_content.encode()).decode()
        return f"data:image/svg+xml;base64,{encoded}"

image_service = ImageService()