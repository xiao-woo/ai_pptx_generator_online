from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OutlineSection(BaseModel):
    id: str
    title: str
    content: str
    order: int

class OutlineBase(BaseModel):
    topic: str
    sections: List[OutlineSection]

class OutlineCreate(BaseModel):
    topic: str
    preferences: Optional[dict] = None

class OutlineUpdate(BaseModel):
    outline_id: str
    instruction: str

class Outline(OutlineBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True