from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
import datetime
import enum
from .database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    board_type = Column(String, default="arduino:avr:uno")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    sketches = relationship("Sketch", back_populates="project")
    chats = relationship("ChatHistory", back_populates="project")
    diagrams = relationship("Diagram", back_populates="project")

class Sketch(Base):
    __tablename__ = "sketches"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    content = Column(Text)
    version = Column(Integer, default=1)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="sketches")

class RoleEnum(str, enum.Enum):
    user = "user"
    agent = "agent"
    system = "system"

class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    role = Column(Enum(RoleEnum))
    message = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    project = relationship("Project", back_populates="chats")

class Diagram(Base):
    __tablename__ = "diagram_json"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    content = Column(Text)

    project = relationship("Project", back_populates="diagrams")
