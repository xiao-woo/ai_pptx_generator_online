from sqlalchemy import Column, String, DateTime, Text
from datetime import datetime
from app.database import Base

class Outline(Base):
    __tablename__ = "outlines"

    id = Column(String, primary_key=True, index=True)
    topic = Column(String, nullable=False)
    sections = Column(Text, nullable=False)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)