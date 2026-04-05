from sqlalchemy.orm import Session
from . import models, schemas
from .auth import get_password_hash, verify_password

# Admin

def create_admin(db: Session, admin: schemas.AdminUserCreate):
    hashed_password = get_password_hash(admin.password)
    db_admin = models.AdminUser(
        username=admin.username,
        email=admin.email,
        hashed_password=hashed_password
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin


def get_admin_by_username(db: Session, username: str):
    return db.query(models.AdminUser).filter(models.AdminUser.username == username).first()


def authenticate_admin(db: Session, username: str, password: str):
    admin = get_admin_by_username(db, username)
    if not admin or not verify_password(password, admin.hashed_password):
        return False
    return admin

# Site content CRUD

def get_site_content(db: Session):
    return db.query(models.SiteContent).all()


def get_site_content_by_key(db: Session, key: str):
    return db.query(models.SiteContent).filter(models.SiteContent.key == key).first()


def upsert_site_content(db: Session, content: schemas.SiteContentCreate):
    item = get_site_content_by_key(db, content.key)
    if item:
        item.value = content.value
    else:
        item = models.SiteContent(key=content.key, value=content.value)
        db.add(item)
    db.commit()
    db.refresh(item)
    return item


def delete_site_content(db: Session, key: str):
    item = get_site_content_by_key(db, key)
    if item:
        db.delete(item)
        db.commit()
    return item

# Facility CRUD

def create_facility(db: Session, facility: schemas.FacilityCreate):
    db_facility = models.Facility(**facility.dict())
    db.add(db_facility)
    db.commit()
    db.refresh(db_facility)
    return db_facility


def get_facilities(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Facility).offset(skip).limit(limit).all()


def update_facility(db: Session, facility_id: int, facility: schemas.FacilityCreate):
    db_facility = db.query(models.Facility).filter(models.Facility.id == facility_id).first()
    if db_facility:
        for key, value in facility.dict().items():
            setattr(db_facility, key, value)
        db.commit()
        db.refresh(db_facility)
    return db_facility


def delete_facility(db: Session, facility_id: int):
    db_facility = db.query(models.Facility).filter(models.Facility.id == facility_id).first()
    if db_facility:
        db.delete(db_facility)
        db.commit()
    return db_facility

# Gallery CRUD

def create_gallery_image(db: Session, image: schemas.GalleryImageCreate):
    db_image = models.GalleryImage(**image.dict())
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image


def get_gallery_images(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.GalleryImage).offset(skip).limit(limit).all()


def update_gallery_image(db: Session, image_id: int, image: schemas.GalleryImageCreate):
    db_image = db.query(models.GalleryImage).filter(models.GalleryImage.id == image_id).first()
    if db_image:
        db_image.url = image.url
        db_image.caption = image.caption
        db.commit()
        db.refresh(db_image)
    return db_image


def delete_gallery_image(db: Session, image_id: int):
    db_image = db.query(models.GalleryImage).filter(models.GalleryImage.id == image_id).first()
    if db_image:
        db.delete(db_image)
        db.commit()
    return db_image

# Events CRUD

def create_event(db: Session, event: schemas.EventCreate):
    db_event = models.Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Event).offset(skip).limit(limit).all()


def update_event(db: Session, event_id: int, event: schemas.EventCreate):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if db_event:
        for key, value in event.dict().items():
            setattr(db_event, key, value)
        db.commit()
        db.refresh(db_event)
    return db_event


def delete_event(db: Session, event_id: int):
    db_event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if db_event:
        db.delete(db_event)
        db.commit()
    return db_event

# Results CRUD

def create_result(db: Session, result: schemas.ResultCreate):
    db_result = models.Result(**result.dict())
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result


def get_results(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Result).order_by(models.Result.rank.asc(), models.Result.created_at.desc()).offset(skip).limit(limit).all()


def update_result(db: Session, result_id: int, result: schemas.ResultCreate):
    db_result = db.query(models.Result).filter(models.Result.id == result_id).first()
    if db_result:
        for key, value in result.dict().items():
            setattr(db_result, key, value)
        db.commit()
        db.refresh(db_result)
    return db_result


def delete_result(db: Session, result_id: int):
    db_result = db.query(models.Result).filter(models.Result.id == result_id).first()
    if db_result:
        db.delete(db_result)
        db.commit()
    return db_result

# Contacts CRUD

def create_contact(db: Session, contact: schemas.ContactCreate):
    db_contact = models.Contact(**contact.dict())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact


def get_contacts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Contact).offset(skip).limit(limit).all()

# Admissions CRUD

def create_admission(db: Session, admission: schemas.AdmissionCreate):
    db_admission = models.Admission(**admission.dict())
    db.add(db_admission)
    db.commit()
    db.refresh(db_admission)
    return db_admission


def get_admissions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Admission).offset(skip).limit(limit).all()
