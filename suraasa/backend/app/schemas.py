from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class AdminUserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class AdminUserResponse(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True

class SiteContentCreate(BaseModel):
    key: str
    value: str

class SiteContentResponse(BaseModel):
    id: int
    key: str
    value: str
    updated_at: datetime

    class Config:
        from_attributes = True

class FacilityCreate(BaseModel):
    title: str
    description: str
    image_url: str

class FacilityResponse(BaseModel):
    id: int
    title: str
    description: str
    image_url: str
    created_at: datetime

    class Config:
        from_attributes = True

class GalleryImageCreate(BaseModel):
    url: str
    caption: Optional[str] = None

class GalleryImageResponse(BaseModel):
    id: int
    url: str
    caption: Optional[str]
    uploaded_at: datetime

    class Config:
        from_attributes = True

class EventCreate(BaseModel):
    title: str
    description: str
    date: str
    image_url: Optional[str] = None

class EventResponse(BaseModel):
    id: int
    title: str
    description: str
    date: str
    image_url: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class ResultCreate(BaseModel):
    student_name: str
    grade: str
    subject: str
    rank: int
    is_topper: bool = False

class ResultResponse(BaseModel):
    id: int
    student_name: str
    grade: str
    subject: str
    rank: int
    is_topper: bool
    created_at: datetime

    class Config:
        from_attributes = True

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str]
    message: str
    submitted_at: datetime

    class Config:
        from_attributes = True

class AdmissionCreate(BaseModel):
    student_name: str
    parent_name: str
    email: EmailStr
    phone: str
    grade: str

class AdmissionResponse(BaseModel):
    id: int
    student_name: str
    parent_name: str
    email: str
    phone: str
    grade: str
    submitted_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    username: str
    password: str
