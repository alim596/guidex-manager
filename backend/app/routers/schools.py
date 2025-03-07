from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import event
from app.database import SessionLocal
from app.models import School
from pydantic import BaseModel
from typing import Annotated, List
from app.utils.schools_arr import SCHOOLS
from app.routers.auth import get_current_user

router = APIRouter()

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

# Pydantic Models
class SchoolBase(BaseModel):
    name: str
    city: str

class SchoolResponse(SchoolBase):
    id: int

    class Config:
        from_attributes = True

@router.get("/schools", response_model=List[SchoolResponse])
def get_all_schools(db: db_dependency ):
    """
    Get all schools from the database.
    """
    schools = db.query(School).all()
    return schools

@router.get("/schools/{school_id}", response_model=SchoolResponse)
def get_school(
    school_id: int, 
    db: db_dependency,
    current_user: dict = Depends(get_current_user)):
    """
    Get a single school by ID.
    """
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")
    return school

@router.post("/schools", response_model=SchoolResponse, status_code=status.HTTP_201_CREATED)
def create_school(
    school: SchoolBase,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)):
    """
    Create a new school in the database.
    """
    # Check for duplicates
    existing_school = db.query(School).filter(School.name == school.name, School.city == school.city).first()
    if existing_school:
        raise HTTPException(status_code=400, detail="School with the same name and city already exists")

    new_school = School(name=school.name, city=school.city)
    db.add(new_school)
    db.commit()
    db.refresh(new_school)
    return new_school

@router.put("/schools/{school_id}", response_model=SchoolResponse)
def update_school(
    school_id: int, 
    school: SchoolBase, 
    db: db_dependency, 
    current_user: dict = Depends(get_current_user)):
    """
    Update an existing school by ID.
    """
    db_school = db.query(School).filter(School.id == school_id).first()
    if not db_school:
        raise HTTPException(status_code=404, detail="School not found")

    db_school.name = school.name
    db_school.city = school.city
    db.commit()
    db.refresh(db_school)
    return db_school

@router.delete("/schools/{school_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_school(school_id: int, db: db_dependency, current_user: dict = Depends(get_current_user)):
    """
    Delete a school by ID.
    """
    db_school = db.query(School).filter(School.id == school_id).first()
    if not db_school:
        raise HTTPException(status_code=404, detail="School not found")
    db.delete(db_school)
    db.commit()
    return


#-----------------------------------INIT DB WITH SCHOOLS-----------------------------------------


def populate_schools(db: Session):
    """
    Populate the database with predefined school data.
    """
    for name, city in SCHOOLS.items():
        # Check if the school already exists
        existing_school = db.query(School).filter_by(name=name, city=city).first()
        if not existing_school:
            # Add the new school to the database
            school = School(name=name, city=city)
            db.add(school)
    db.commit()
    print("Schools populated successfully!")

# Listener function
def after_create_listener(target, connection, **kwargs):
    """
    Listener to populate the schools table after it is created.
    """
    db = SessionLocal()
    try:
        populate_schools(db)
    finally:
        db.close()

# Attach the listener to the School table
event.listen(School.__table__, 'after_create', after_create_listener)
