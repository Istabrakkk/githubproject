from pydantic import BaseModel, EmailStr, validator
from typing import Dict, Optional, List, Any
from datetime import datetime

# Schémas pour l'authentification
class UserSignUp(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None

class UserSignIn(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str]
    
    class Config:
        from_attributes = True

# Schémas pour les jobs
class JobResponse(BaseModel):
    id: int
    code: str
    title: str
    description: Optional[str]
    type: str
    salary: Optional[str]
    
    class Config:
        from_attributes = True

# Schémas pour les candidatures
class ApplicationCreate(BaseModel):
    userId: int
    jobCode: str
    firstName: str
    lastName: str
    email: EmailStr
    phone: str
    address: str
    experience: str
    lastPosition: Optional[str] = ""
    skills: str
    education: str
    fieldOfStudy: str
    github: Optional[str] = ""
    jobAnswers: Optional[Dict[str, Any]] = {}
    personalityAnswers: Optional[Dict[str, Any]] = {}
    
    @validator('jobAnswers', pre=True)
    def validate_job_answers(cls, v):
        if v is None:
            return {}
        if isinstance(v, str):
            import json
            try:
                return json.loads(v)
            except:
                return {}
        return v if isinstance(v, dict) else {}
    
    @validator('personalityAnswers', pre=True)
    def validate_personality_answers(cls, v):
        if v is None:
            return {}
        if isinstance(v, str):
            import json
            try:
                return json.loads(v)
            except:
                return {}
        return v if isinstance(v, dict) else {}

class ApplicationResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    compatibility_score: int
    status: str
    created_at: datetime
    job: JobResponse
    
    class Config:
        from_attributes = True