from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import uuid
import httpx

from app.database import get_db
from app.models.feedback import Feedback
from app.schemas.feedback import FeedbackCreate
from app.config import settings

router = APIRouter()

@router.post("/")
async def submit_feedback(
    data: FeedbackCreate,
    db: AsyncSession = Depends(get_db)
):
    """提交反馈"""
    try:
        # 保存到数据库
        feedback_id = str(uuid.uuid4())
        feedback = Feedback(
            id=feedback_id,
            type=data.type,
            title=data.title,
            description=data.description,
            email=data.email,
            created_at=datetime.utcnow()
        )

        db.add(feedback)
        await db.commit()

        # 如果配置了 GitHub，创建 Issue
        if settings.github_token and settings.github_repo:
            await _create_github_issue(data)

        return {
            "id": feedback.id,
            "type": feedback.type,
            "title": feedback.title,
            "description": feedback.description,
            "email": feedback.email,
            "created_at": feedback.created_at
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

async def _create_github_issue(data: FeedbackCreate):
    """创建 GitHub Issue"""
    try:
        # 根据 type 设置标签
        labels = {
            "bug": ["bug"],
            "feature": ["enhancement"],
            "improvement": ["enhancement"]
        }

        issue_data = {
            "title": f"[{data.type.upper()}] {data.title}",
            "body": f"**类型:** {data.type}\n\n**描述:**\n{data.description}",
            "labels": labels.get(data.type, ["feedback"])
        }

        if data.email:
            issue_data["body"] += f"\n\n**联系邮箱:** {data.email}"

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://api.github.com/repos/{settings.github_repo}/issues",
                json=issue_data,
                headers={
                    "Authorization": f"token {settings.github_token}",
                    "Accept": "application/vnd.github.v3+json"
                },
                timeout=30.0
            )
            response.raise_for_status()
    except Exception as e:
        print(f"Failed to create GitHub issue: {e}")
        # 不影响主流程，只记录日志