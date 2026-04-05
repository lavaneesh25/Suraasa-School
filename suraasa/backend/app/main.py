import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from sqlalchemy import inspect, text
from .database import Base, engine, SessionLocal
from .routes import router
from .crud import (get_admin_by_username, create_admin, get_site_content_by_key, upsert_site_content,
                   get_facilities, create_facility, get_events, create_event, get_results, create_result,
                   get_gallery_images, create_gallery_image)
from .schemas import (AdminUserCreate, SiteContentCreate, FacilityCreate, EventCreate, ResultCreate, 
                      GalleryImageCreate)

Base.metadata.create_all(bind=engine)


def migrate_results_table():
    inspector = inspect(engine)
    columns = {column["name"] for column in inspector.get_columns("results")}

    if "rank" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE results ADD COLUMN rank INTEGER"))

            if "percentage" in columns:
                ordered_rows = connection.execute(text("SELECT id FROM results ORDER BY percentage DESC, created_at ASC")).fetchall()
                for index, row in enumerate(ordered_rows, start=1):
                    connection.execute(
                        text("UPDATE results SET rank = :rank WHERE id = :id"),
                        {"rank": index, "id": row.id}
                    )

    with engine.begin() as connection:
        missing_rank_rows = connection.execute(text("SELECT id FROM results WHERE rank IS NULL ORDER BY created_at ASC, id ASC")).fetchall()
        if missing_rank_rows:
            start_rank = connection.execute(text("SELECT COALESCE(MAX(rank), 0) FROM results")).scalar() or 0
            for offset, row in enumerate(missing_rank_rows, start=1):
                connection.execute(
                    text("UPDATE results SET rank = :rank WHERE id = :id"),
                    {"rank": start_rank + offset, "id": row.id}
                )


migrate_results_table()

# Seed a default admin user for first-time setup (change credentials in production)

def init_default_admin():
    db = SessionLocal()
    try:
        if not get_admin_by_username(db, 'lavan'):
            create_admin(db, AdminUserCreate(username='lavan', email='lavan@suraasa.com', password='suraasa'))
            print('Created default admin user: lavan / suraasa')
    finally:
        db.close()


def init_default_site_content():
    db = SessionLocal()
    try:
        defaults = {
            'hero_title': 'SURAASA SCHOOL (IIT Campus), Vemulawada',
            'hero_subtitle': 'ADMISSIONS OPEN 2026-27',
            'hero_cta': 'Enquire Now',
            'logo_url': '/suraasa-logo.jpeg',
            'hero_background': 'https://images.unsplash.com/photo-1528014425626-1867c1f74a7a?auto=format&fit=crop&w=1600&q=80',
            'campus_title': 'THE CAMPUS EXPERIENCE',
            'campus_description': 'A modern campus with world-class facilities, science labs, sports arenas and calm learning zones.'
        }
        for key, value in defaults.items():
            if not get_site_content_by_key(db, key):
                upsert_site_content(db, SiteContentCreate(key=key, value=value))
    finally:
        db.close()


def init_default_facilities():
    db = SessionLocal()
    try:
        if len(get_facilities(db)) == 0:
            facilities = [
                FacilityCreate(
                    title="Science Laboratory",
                    description="Well-equipped with modern apparatus for Physics, Chemistry and Biology experiments",
                    image_url="https://images.unsplash.com/photo-1576914550839-efb5eaccf989?auto=format&fit=crop&w=500&q=60"
                ),
                FacilityCreate(
                    title="Computer Lab",
                    description="Latest computers with high-speed internet for coding and IT learning",
                    image_url="https://images.unsplash.com/photo-1517694712202-14819c9cb6e1?auto=format&fit=crop&w=500&q=60"
                ),
                FacilityCreate(
                    title="Sports Complex",
                    description="Indoor and outdoor facilities for cricket, basketball, badminton and other sports",
                    image_url="https://images.unsplash.com/photo-1517694712025-f8f99dd4c155?auto=format&fit=crop&w=500&q=60"
                )
            ]
            for facility in facilities:
                create_facility(db, facility)
    finally:
        db.close()


def init_default_events():
    db = SessionLocal()
    try:
        if len(get_events(db)) == 0:
            events = [
                EventCreate(
                    title="Annual Sports Day",
                    description="Celebrating sportsmanship and athletic excellence",
                    date="2026-04-20",
                    image_url="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=500&q=60"
                ),
                EventCreate(
                    title="Science Fair 2026",
                    description="Students showcase innovative projects and scientific discoveries",
                    date="2026-05-15",
                    image_url="https://images.unsplash.com/photo-1576914550839-efb5eaccf989?auto=format&fit=crop&w=500&q=60"
                )
            ]
            for event in events:
                create_event(db, event)
    finally:
        db.close()


def init_default_results():
    db = SessionLocal()
    try:
        if len(get_results(db)) == 0:
            results = [
                ResultCreate(
                    student_name="Arjun Kumar",
                    grade="XII-A",
                    subject="Mathematics",
                    rank=1,
                    is_topper=True
                ),
                ResultCreate(
                    student_name="Priya Sharma",
                    grade="XII-B",
                    subject="Physics",
                    rank=2,
                    is_topper=True
                ),
                ResultCreate(
                    student_name="Rohan Patel",
                    grade="XII-A",
                    subject="Chemistry",
                    rank=3,
                    is_topper=False
                )
            ]
            for result in results:
                create_result(db, result)
    finally:
        db.close()


def init_default_gallery():
    db = SessionLocal()
    try:
        if len(get_gallery_images(db)) == 0:
            gallery_items = [
                GalleryImageCreate(
                    url="https://images.unsplash.com/photo-1427504494785-cdda8e3a87f0?auto=format&fit=crop&w=500&q=60",
                    caption="School Building"
                ),
                GalleryImageCreate(
                    url="https://images.unsplash.com/photo-1497633762265-25c1491266cb?auto=format&fit=crop&w=500&q=60",
                    caption="Classroom Activities"
                ),
                GalleryImageCreate(
                    url="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=500&q=60",
                    caption="Library"
                )
            ]
            for item in gallery_items:
                create_gallery_image(db, item)
    finally:
        db.close()


init_default_admin()
init_default_site_content()
init_default_facilities()
init_default_events()
init_default_results()
init_default_gallery()

app = FastAPI(
    title="SURAASA SCHOOL ",
    description=" School Website API",
    version="1.0.0"
)

allowed_origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api", tags=["API"])

# Create uploads directory if it doesn't exist
uploads_dir = Path("uploads")
uploads_dir.mkdir(exist_ok=True)

# Mount static files for uploaded images
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

# Serve frontend static files in production (built by Render)
static_dir = Path(__file__).resolve().parent.parent / "static"
if static_dir.exists():
    from fastapi.responses import FileResponse

    @app.get("/")
    def serve_index():
        return FileResponse(static_dir / "index.html")

    app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="frontend")
else:
    @app.get("/")
    def read_root():
        return {"message": "SURAASA SCHOOL API - Running"}
