from fastapi import APIRouter
from app.services.ppt_service import ppt_service

router = APIRouter()

@router.get("/")
async def get_templates():
    """获取所有模板"""
    return ppt_service.get_templates()