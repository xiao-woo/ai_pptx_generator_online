from sqlalchemy import Column, String, DateTime, Text
from datetime import datetime
from app.database import Base

class PPT(Base):
    __tablename__ = "ppts"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    slides = Column(Text, nullable=False)  # JSON string
    template_id = Column(String, nullable=False)
    outline_id = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)