from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from datetime import datetime
import json
import uuid

from app.database import get_db
from app.models.ppt import PPT
from app.models.outline import Outline
from app.schemas.ppt import PPTCreate, PPT
from app.services.ppt_service import ppt_service

router = APIRouter()

@router.post("/generate", response_model=PPT)
async def generate_ppt(
    data: PPTCreate,
    db: AsyncSession = Depends(get_db)
):
    """生成 PPT"""
    try:
        # 获取大纲
        result = await db.execute(select(Outline).where(Outline.id == data.outline_id))
        outline = result.scalar_one_or_none()

        if not outline:
            raise HTTPException(status_code=404, detail="Outline not found")

        outline_data = {
            "id": outline.id,
            "topic": outline.topic,
            "sections": json.loads(outline.sections),
            "created_at": outline.created_at.isoformat()
        }

        # 生成 PPT
        ppt_data = await ppt_service.generate_ppt(outline_data, data.template_id)

        # 保存到数据库
        ppt_id = str(uuid.uuid4())
        ppt = PPT(
            id=ppt_id,
            title=ppt_data["title"],
            slides=json.dumps(ppt_data["slides"], ensure_ascii=False),
            template_id=data.template_id,
            outline_id=data.outline_id,
            created_at=datetime.utcnow()
        )

        db.add(ppt)
        await db.commit()
        await db.refresh(ppt)

        return ppt_data
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{ppt_id}", response_model=PPT)
async def get_ppt(
    ppt_id: str,
    db: AsyncSession = Depends(get_db)
):
    """获取 PPT"""
    result = await db.execute(select(PPT).where(PPT.id == ppt_id))
    ppt = result.scalar_one_or_none()

    if not ppt:
        raise HTTPException(status_code=404, detail="PPT not found")

    template = ppt_service.templates.get(ppt.template_id, ppt_service.templates["modern-blue"])

    return {
        "id": ppt.id,
        "title": ppt.title,
        "slides": json.loads(ppt.slides),
        "template": template,
        "created_at": ppt.created_at
    }

@router.get("/{ppt_id}/export")
async def export_ppt(
    ppt_id: str,
    format: str = "pptx",
    db: AsyncSession = Depends(get_db)
):
    """导出 PPT"""
    result = await db.execute(select(PPT).where(PPT.id == ppt_id))
    ppt = result.scalar_one_or_none()

    if not ppt:
        raise HTTPException(status_code=404, detail="PPT not found")

    try:
        ppt_data = {
            "id": ppt.id,
            "title": ppt.title,
            "slides": json.loads(ppt.slides),
            "template": ppt_service.templates.get(ppt.template_id, ppt_service.templates["modern-blue"])
        }

        buffer = ppt_service.create_pptx(ppt_data)

        return Response(
            content=buffer.getvalue(),
            media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
            headers={
                "Content-Disposition": f'attachment; filename="{ppt.title}.pptx"'
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{ppt_id}")
async def delete_ppt(
    ppt_id: str,
    db: AsyncSession = Depends(get_db)
):
    """删除 PPT"""
    result = await db.execute(select(PPT).where(PPT.id == ppt_id))
    ppt = result.scalar_one_or_none()

    if not ppt:
        raise HTTPException(status_code=404, detail="PPT not found")

    await db.execute(delete(PPT).where(PPT.id == ppt_id))
    await db.commit()

    return {"message": "PPT deleted successfully"}