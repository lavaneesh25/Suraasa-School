from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from datetime import timedelta
from . import crud, schemas, auth
from .database import get_db
import os
import shutil
from pathlib import Path

router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/token", response_model=schemas.TokenResponse)
def login(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    admin = crud.authenticate_admin(db, request.username, request.password)
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": admin.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/site-content", response_model=list[schemas.SiteContentResponse])
def get_site_content(db: Session = Depends(get_db)):
    return crud.get_site_content(db)

@router.get("/site-content/{key}", response_model=schemas.SiteContentResponse)
def get_site_content_by_key(key: str, db: Session = Depends(get_db)):
    content = crud.get_site_content_by_key(db, key)
    if not content:
        raise HTTPException(status_code=404, detail="Site content not found")
    return content

@router.post("/site-content", response_model=schemas.SiteContentResponse)
def upsert_site_content(content: schemas.SiteContentCreate, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    auth.verify_token(token)
    return crud.upsert_site_content(db, content)

@router.delete("/site-content/{key}")
def delete_site_content(key: str, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    auth.verify_token(token)
    item = crud.delete_site_content(db, key)
    if not item:
        raise HTTPException(status_code=404, detail="Site content not found")
    return {"message": "Deleted"}

# Facility endpoints
@router.get("/facilities", response_model=list[schemas.FacilityResponse])
def get_facilities(db: Session = Depends(get_db)):
    return crud.get_facilities(db)

@router.post("/facilities", response_model=schemas.FacilityResponse)
def create_facility(facility: schemas.FacilityCreate, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    auth.verify_token(token)
    return crud.create_facility(db, facility)

@router.put("/facilities/{facility_id}", response_model=schemas.FacilityResponse)
def update_facility(facility_id: int, facility: schemas.FacilityCreate, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    auth.verify_token(token)
    updated = crud.update_facility(db, facility_id, facility)
    if not updated:
        raise HTTPException(status_code=404, detail="Facility not found")
    return updated

@router.delete("/facilities/{facility_id}")
def delete_facility(facility_id: int, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    auth.verify_token(token)
    deleted = crud.delete_facility(db, facility_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Facility not found")
    return {"message": "Deleted"}

# Gallery endpoints
@router.get("/gallery", response_model=list[schemas.GalleryImageResponse])
def get_gallery(db: Session = Depends(get_db)):
    return crud.get_gallery_images(db)

@router.post("/gallery", response_model=schemas.GalleryImageResponse)
def create_gallery(image: schemas.GalleryImageCreate, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    auth.verify_token(token)
    return crud.create_gallery_image(db, image)

@router.put("/gallery/{image_id}", response_model=schemas.GalleryImageResponse)
def update_gallery(image_id: int, image: schemas.GalleryImageCreate, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    auth.verify_token(token)
    updated = crud.update_gallery_image(db, image_id, image)
    if not updated:
        raise HTTPException(status_code=404, detail="Gallery image not found")
    return updated

@router.delete("/gallery/{image_id}")
def delete_gallery(image_id: int, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    auth.verify_token(token)
    deleted = crud.delete_gallery_image(db, image_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Gallery image not found")
    return {"message": "Deleted"}

# Events endpoints
@router.get("/events", response_model=list[schemas.EventResponse])
def get_events(db: Session = Depends(get_db)):
    return crud.get_events(db)

@router.post("/events", response_model=schemas.EventResponse)
def create_event(event: schemas.EventCreate, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    auth.verify_token(token)
    return crud.create_event(db, event)

@router.put("/events/{event_id}", response_model=schemas.EventResponse)
def update_event(event_id: int, event: schemas.EventCreate, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    auth.verify_token(token)
    updated = crud.update_event(db, event_id, event)
    if not updated:
        raise HTTPException(status_code=404, detail="Event not found")
    return updated

@router.delete("/events/{event_id}")
def delete_event(event_id: int, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    auth.verify_token(token)
    deleted = crud.delete_event(db, event_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Event not found")
    return {"message": "Deleted"}

# Results endpoints
@router.get("/results", response_model=list[schemas.ResultResponse])
def get_results(db: Session = Depends(get_db)):
    return crud.get_results(db)

@router.post("/results", response_model=schemas.ResultResponse)
def create_result(result: schemas.ResultCreate, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    auth.verify_token(token)
    return crud.create_result(db, result)

@router.put("/results/{result_id}", response_model=schemas.ResultResponse)
def update_result(result_id: int, result: schemas.ResultCreate, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    auth.verify_token(token)
    updated = crud.update_result(db, result_id, result)
    if not updated:
        raise HTTPException(status_code=404, detail="Result not found")
    return updated

@router.delete("/results/{result_id}")
def delete_result(result_id: int, token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    auth.verify_token(token)
    deleted = crud.delete_result(db, result_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Result not found")
    return {"message": "Deleted"}

# Contacts endpoints
@router.get("/contacts", response_model=list[schemas.ContactResponse])
def get_contacts(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    auth.verify_token(token)
    return crud.get_contacts(db)

@router.post("/contacts", response_model=schemas.ContactResponse)
def create_contact(contact: schemas.ContactCreate, db: Session = Depends(get_db)):
    return crud.create_contact(db, contact)

# Admissions endpoints
@router.get("/admissions", response_model=list[schemas.AdmissionResponse])
def get_admissions(token: str = Depends(auth.oauth2_scheme), db: Session = Depends(get_db)):
    auth.verify_token(token)
    return crud.get_admissions(db)

@router.post("/admissions", response_model=schemas.AdmissionResponse)
def create_admission(admission: schemas.AdmissionCreate, db: Session = Depends(get_db)):
    return crud.create_admission(db, admission)

# Admin register (for initial setup)
@router.post("/admin/register", response_model=schemas.AdminUserResponse)
def register_admin(admin: schemas.AdminUserCreate, db: Session = Depends(get_db)):
    existing = crud.get_admin_by_username(db, admin.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    return crud.create_admin(db, admin)

# Image upload endpoint
@router.post("/upload")
def upload_image(file: UploadFile = File(...), token: str = Depends(auth.oauth2_scheme)):
    auth.verify_token(token)
    
    # Validate file type
    ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="File type not allowed. Use: jpg, jpeg, png, gif, webp")
    
    # Generate unique filename
    import uuid
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = UPLOAD_DIR / unique_filename
    
    try:
        # Save the file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Return the relative path that can be used as image URL
        return {
            "url": f"/uploads/{unique_filename}",
            "filename": unique_filename,
            "message": "Image uploaded successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")

