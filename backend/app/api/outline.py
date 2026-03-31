from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from datetime import datetime
from typing import List, Dict
import json
import uuid

from app.database import get_db
from app.models.outline import Outline
from app.schemas.outline import OutlineCreate, OutlineUpdate, Outline
from app.services.llm_service import llm_service

router = APIRouter()

@router.post("/generate", response_model=Outline)
async def generate_outline(
    data: OutlineCreate,
    db: AsyncSession = Depends(get_db)
):
    """生成大纲"""
    try:
        # 调用 LLM 生成大纲
        outline_text = await llm_service.generate_outline(
            data.topic,
            data.preferences
        )

        # 解析大纲文本
        sections = _parse_outline(outline_text)

        # 创建大纲记录
        outline_id = str(uuid.uuid4())
        outline = Outline(
            id=outline_id,
            topic=data.topic,
            sections=json.dumps(sections, ensure_ascii=False),
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        db.add(outline)
        await db.commit()
        await db.refresh(outline)

        return {
            "id": outline.id,
            "topic": outline.topic,
            "sections": sections,
            "created_at": outline.created_at,
            "updated_at": outline.updated_at
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{outline_id}", response_model=Outline)
async def get_outline(
    outline_id: str,
    db: AsyncSession = Depends(get_db)
):
    """获取大纲"""
    result = await db.execute(select(Outline).where(Outline.id == outline_id))
    outline = result.scalar_one_or_none()

    if not outline:
        raise HTTPException(status_code=404, detail="Outline not found")

    return {
        "id": outline.id,
        "topic": outline.topic,
        "sections": json.loads(outline.sections),
        "created_at": outline.created_at,
        "updated_at": outline.updated_at
    }

@router.post("/update", response_model=Outline)
async def update_outline(
    data: OutlineUpdate,
    db: AsyncSession = Depends(get_db)
):
    """更新大纲"""
    result = await db.execute(select(Outline).where(Outline.id == data.outline_id))
    outline = result.scalar_one_or_none()

    if not outline:
        raise HTTPException(status_code=404, detail="Outline not found")

    try:
        # 获取当前大纲
        current_sections = json.loads(outline.sections)
        current_outline_text = _sections_to_text(current_sections)

        # 调用 LLM 更新大纲
        updated_outline_text = await llm_service.update_outline(
            current_outline_text,
            data.instruction
        )

        # 解析更新后的大纲
        updated_sections = _parse_outline(updated_outline_text)

        # 更新数据库
        await db.execute(
            update(Outline)
            .where(Outline.id == data.outline_id)
            .values(
                sections=json.dumps(updated_sections, ensure_ascii=False),
                updated_at=datetime.utcnow()
            )
        )
        await db.commit()

        return {
            "id": outline.id,
            "topic": outline.topic,
            "sections": updated_sections,
            "created_at": outline.created_at,
            "updated_at": datetime.utcnow()
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{outline_id}")
async def delete_outline(
    outline_id: str,
    db: AsyncSession = Depends(get_db)
):
    """删除大纲"""
    result = await db.execute(select(Outline).where(Outline.id == outline_id))
    outline = result.scalar_one_or_none()

    if not outline:
        raise HTTPException(status_code=404, detail="Outline not found")

    await db.execute(delete(Outline).where(Outline.id == outline_id))
    await db.commit()

    return {"message": "Outline deleted successfully"}

def _parse_outline(text: str) -> List[Dict]:
    """解析大纲文本"""
    sections = []
    lines = text.strip().split('\n')
    current_section = None

    for line in lines:
        line = line.strip()
        if not line:
            continue

        if line.startswith('章节') or line.startswith('Section'):
            if current_section:
                sections.append(current_section)
            parts = line.split('：', 1)
            if len(parts) == 2:
                title = parts[1].strip()
            else:
                title = line.strip()
            current_section = {
                "id": str(uuid.uuid4()),
                "title": title,
                "content": "",
                "order": len(sections)
            }
        elif current_section and line.startswith('内容：'):
            current_section["content"] = line.replace('内容：', '').strip()
        elif current_section and current_section["content"]:
            current_section["content"] += "\n" + line

    if current_section:
        sections.append(current_section)

    return sections

def _sections_to_text(sections: List[Dict]) -> str:
    """将章节列表转换为文本"""
    lines = []
    for i, section in enumerate(sections):
        lines.append(f"章节 {i+1}：{section['title']}")
        lines.append(f"内容：{section['content']}")
        lines.append("")
    return "\n".join(lines)