from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
import uuid

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    ai_usage_count = Column(Integer, default=0)


class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    tags = Column(String, default="")
    owner = Column(String, nullable=False, index=True)
    is_archived = Column(Boolean, default=False)
    is_public = Column(Boolean, default=False)
    share_id = Column(String, default=lambda: str(uuid.uuid4()), unique=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
