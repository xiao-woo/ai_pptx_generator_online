from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FeedbackCreate(BaseModel):
    type: str  # bug, feature, improvement
    title: str
    description: str
    email: Optional[str] = None

class Feedback(FeedbackCreate):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True