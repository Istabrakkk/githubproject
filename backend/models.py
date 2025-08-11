from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime, Enum
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime
import enum

class JobType(enum.Enum):
    CDI = "CDI"
    CDD = "CDD"
    STAGE = "Stage"
    FREELANCE = "Freelance"

class ApplicationStatus(enum.Enum):
    PENDING = "pending"
    REVIEWED = "reviewed"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(191), unique=True, nullable=False)
    full_name = Column(String(200), nullable=False)
    password_hash = Column(String(200), nullable=False)
    phone = Column(String(40))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    applications = relationship("Application", back_populates="user")

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    type = Column(Enum(JobType), default=JobType.CDI)
    salary = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    applications = relationship("Application", back_populates="job")

class Application(Base):
    __tablename__ = "applications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"))
    
    # Informations personnelles
    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)
    email = Column(String(191), nullable=False)
    phone = Column(String(50))
    address = Column(Text)
    
    # Expérience et formation
    experience = Column(String(50))
    last_position = Column(String(255))
    skills = Column(Text)
    education = Column(String(50))
    field_of_study = Column(String(255))
    
    # Documents
    cv_filename = Column(String(255))
    github = Column(String(255))
    
    # Réponses aux questions
    job_answers = Column(Text)  # JSON string
    personality_answers = Column(Text)  # JSON string
    
    # Évaluation
    compatibility_score = Column(Integer, default=0)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relations
    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")