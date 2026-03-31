from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PPTSlide(BaseModel):
    id: str
    title: str
    content: str
    layout: str
    images: Optional[List[str]] = None

class Template(BaseModel):
    id: str
    name: str
    description: str
    thumbnail: str
    color_scheme: List[str]
    category: str

class PPTBase(BaseModel):
    title: str
    slides: List[PPTSlide]
    template: Template

class PPTCreate(BaseModel):
    outline_id: str
    template_id: str

class PPT(PPTBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True