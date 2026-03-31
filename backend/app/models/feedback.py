from sqlalchemy import Column, String, DateTime, Text
from datetime import datetime
from app.database import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(String, primary_key=True, index=True)
    type = Column(String, nullable=False)  # bug, feature, improvement
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    email = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)