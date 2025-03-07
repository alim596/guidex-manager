from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Annotated
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.routers.auth import get_current_user  # Import JWT auth dependency
from app.models import AppointmentBase, Appointment, AppointmentResponse, AppointmentStatus, AppointmentStatusUpdate, User, AppointmentCreateBase, School
from app.routers.notifications import notify_admins, notify_guides, notify_user
import json
import os
# Create the APIRouter instance
router = APIRouter()

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]


#CRUD functions
@router.get("/", response_model=List[AppointmentBase])
async def get_all_appointments(
    db: db_dependency, 
    current_user: dict = Depends(get_current_user), 
):
    user_id = current_user['user_id']
    appointments = db.query(Appointment).all()
    return appointments

# Get all appointments (for the current user)
@router.get("/appointment", response_model=List[AppointmentBase])
async def get_appointments(
    db: db_dependency, 
    current_user: dict = Depends(get_current_user), 
    skip: int = 0, 
    limit: int = 10
):
    user_id = current_user['user_id']
    appointments = db.query(Appointment).filter(
        Appointment.user_id == user_id
    ).offset(skip).limit(limit).all()
    return appointments

# Get appointment by ID
@router.get("/{appointment_id}", response_model=AppointmentBase)
async def get_appointment(
    appointment_id: int, 
    db: db_dependency, 
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user['user_id']
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.user_id == user_id
    ).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

# Create a new appointment

@router.post("/create-appointment", status_code=201)
async def create_appointment(
    appointment: AppointmentCreateBase,
    db: db_dependency,
    current_user: dict = Depends(get_current_user),
):
    """
    Create a new appointment, notify admins, and confirm the appointment for the user.
    """
    user_id = current_user["user_id"]
    
    # Retrieve the user's school ID
    user_school_id = db.query(User.school_id).filter(User.id == user_id).first()
    if not user_school_id or not user_school_id[0]:
        raise HTTPException(status_code=404, detail="User's school not found")
    
    # Retrieve the school details using the school ID
    school = db.query(School).filter(School.id == user_school_id[0]).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found in the database")

    city = school.city
    if not city:
        raise HTTPException(status_code=404, detail="City for the school not found")

    # Create the appointment with city included
    db_appointment = Appointment(
        **appointment.dict(), user_id=user_id, city=city
    )
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)

    # Notify admins about the new appointment
    await notify_admins(
        appointment_id=db_appointment.id,
        message=f"A new appointment has been made at {db_appointment.date}, {db_appointment.time}.",
        notification_type="New Appointment",
        db=db,
    )

    # Notify the user about their appointment confirmation
    await notify_user(
        recipient_id=user_id,
        appointment_id=db_appointment.id,
        message=f"Your appointment has been created for {db_appointment.date}, {db_appointment.time}. Waiting for confirmation.",
        notification_type="Appointment Created",
        db=db,
    )

    return db_appointment


# Update appointment
@router.put("/{appointment_id}", response_model=AppointmentBase)
async def update_appointment(
    appointment_id: int, 
    updated_data: AppointmentBase, 
    db: db_dependency, 
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user['user_id']
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.user_id == user_id
    ).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    for key, value in updated_data.model_dump(exclude_unset=True).items():
        setattr(appointment, key, value)
    db.commit()
    db.refresh(appointment)
    return appointment

# Delete appointment
@router.delete("/{appointment_id}", status_code=204)
async def delete_appointment(
    appointment_id: int, 
    db: db_dependency, 
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user['user_id']
    appointment = db.query(Appointment).filter(
        Appointment.id == appointment_id,
        Appointment.user_id == user_id
    ).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    db.delete(appointment)
    db.commit()
    return {"detail": "Appointment deleted successfully"}



# Managing Status


# Utils
@router.get("/user/appointments", response_model=List[AppointmentResponse])
async def get_appointments_for_user(
    db: db_dependency,
    current_user: dict = Depends(get_current_user)  # Use JWT to get current user
):
    """
    Fetch all appointments created by a user (user_id).
    """
    user_id = current_user['user_id']
    appointments = db.query(Appointment).filter(Appointment.user_id == user_id).all()
    if not appointments:
        raise HTTPException(status_code=404, detail="No appointments found for this user.")
    return appointments


@router.get("/guides/available-appointments", response_model=List[AppointmentResponse])
async def get_available_appointments_for_guides(
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """
    Fetch all appointments available for guides to accept, including school names.
    """
    appointments = (
        db.query(
            Appointment.id,
            Appointment.user_id,
            Appointment.guide_id,
            Appointment.date,
            Appointment.time,
            Appointment.city,
            Appointment.visitors_number,
            Appointment.note,
            Appointment.status,
            Appointment.created_at,
            School.name.label("school_name"),  # Join to fetch school name
        )
        .join(User, User.id == Appointment.user_id)  # Join with User table
        .join(School, School.id == User.school_id)   # Join with School table
        .filter(Appointment.status == "approved", Appointment.guide_id == None)
        .all()
    )

    if not appointments:
        raise HTTPException(status_code=404, detail="No available appointments for guides.")

    return appointments



@router.get("/guide/appointments", response_model=List[AppointmentResponse])
async def get_assigned_appointments_for_guide(
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """
    Fetch all appointments assigned to the current guide, including the school name.
    """
    guide_id = current_user["user_id"]

    # Query appointments, join with User and School tables to fetch the school name
    appointments = (
        db.query(
            Appointment,
            School.name.label("school_name")
        )
        .join(User, Appointment.user_id == User.id)  # Join with User
        .join(School, User.school_id == School.id)  # Join with School
        .filter(Appointment.guide_id == guide_id)
        .all()
    )

    if not appointments:
        raise HTTPException(status_code=404, detail="No appointments found for this guide.")

    # Convert query result into response objects
    return [
        AppointmentResponse(
            id=appointment.Appointment.id,
            user_id=appointment.Appointment.user_id,
            guide_id=appointment.Appointment.guide_id,
            date=appointment.Appointment.date,
            time=appointment.Appointment.time,
            city=appointment.Appointment.city,
            visitors_number=appointment.Appointment.visitors_number,
            note=appointment.Appointment.note,
            status=appointment.Appointment.status,
            created_at=appointment.Appointment.created_at,
            school_name=appointment.school_name  # Include school_name
        )
        for appointment in appointments
    ]

# Getters and Setters for Appointments

@router.get("/appointments/{appointment_id}", response_model=AppointmentResponse)
async def get_appointment_by_id(
    appointment_id: int,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """
    Fetch an appointment by its ID.
    """
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found.")
    return appointment

@router.get("/appointments/status/{status}", response_model=List[AppointmentResponse])
async def get_appointments_by_status(
    status: str, 
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
    ):
    """
    Fetch appointments with a specific status.
    """
    appointments = db.query(Appointment).filter(Appointment.status == status).all()
    return appointments

@router.put("/appointments/{appointment_id}/status")
async def set_appointment_status(appointment_id: int, update: AppointmentStatusUpdate, db: Session = Depends(get_db)):
    """
    Update the status of an appointment.
    """
    appointment = await get_appointment_by_id(appointment_id, db)
    appointment.status = update.status
    db.commit()
    db.refresh(appointment)
    return appointment

@router.put("/appointments/{appointment_id}/reject")
async def reject_appointment(appointment_id: int, db: Session = Depends(get_db)):
    """
    Update the status of an appointment.
    """
    appointment = await get_appointment_by_id(appointment_id, db)
    appointment.status = AppointmentStatus.REJECTED
    db.commit()
    db.refresh(appointment)
    return appointment

@router.put("/appointments/{appointment_id}/approve")
async def approve_appointment(appointment_id: int, db: Session = Depends(get_db)):
    """
    Update the status of an appointment.
    """
    appointment = await get_appointment_by_id(appointment_id, db)
    appointment.status = AppointmentStatus.APPROVED
    db.commit()
    db.refresh(appointment)

    await notify_guides(
        appointment_id=appointment.id,
        message=f"A new appointment has been approved, you can Accept it now!.",
        notification_type="Appointment Approved",
        db=db
    )
    
    # Notify the user about their appointment confirmation
    await notify_user(
        recipient_id=appointment.user_id,
        appointment_id=appointment.id,
        message=f"Your appointment has been confirmed for {appointment.date}, {appointment.time}.",
        notification_type="Appointment Confirmed",
        db=db,
    )

    return appointment

@router.put("/appointments/{appointment_id}/assign-guide")
async def assign_guide_to_appointment(
    appointment_id: int, 
    db: db_dependency,
    current_user: dict = Depends(get_current_user)):
    """
    Assign a guide to an appointment.
    """
    appointment = await get_appointment_by_id(appointment_id, db)
    
    if appointment.status != AppointmentStatus.APPROVED:
        raise HTTPException(status_code=400, detail="Only approved appointments can be assigned." + str(appointment.status))
    if appointment.guide_id is not None:
        raise HTTPException(status_code=400, detail="Appointment already assigned to a guide.")
    appointment.guide_id = current_user['user_id']
    appointment.status = AppointmentStatus.ACCEPTED  # Update status to accepted
    db.commit()
    db.refresh(appointment)
    return appointment

@router.put("/appointments/{appointment_id}/unassign-guide")
async def unassign_guide_from_appointment(appointment_id: int, newStatus: AppointmentStatusUpdate, db: Session = Depends(get_db)):
    """
    Remove a guide from an appointment.
    """
    appointment = await get_appointment_by_id(appointment_id, db)
    if appointment.guide_id is not None:
        appointment.guide_id = None
    appointment.status = newStatus.status
    db.commit()
    db.refresh(appointment)
    return appointment

@router.put("/appointments/{appointment_id}")
async def update_appointment_details(appointment_id: int, updates: dict, db: Session = Depends(get_db)):
    """
    Update specific details of an appointment.
    :param updates: Dictionary of fields to update and their new values.
    """
    appointment = await get_appointment_by_id(appointment_id, db)
    for key, value in updates.items():
        if hasattr(appointment, key):
            setattr(appointment, key, value)
    db.commit()
    db.refresh(appointment)
    return appointment


@router.get("/appointments/available-times/{date}", response_model=List[str])
async def get_available_times_for_date(
    date: str,
    db: Session = Depends(get_db)
):
    """
    Get a list of available times for a specific date.
    """
    # Query booked times for the date
    appointments = db.query(Appointment).filter(Appointment.date == date).all()
    booked_times = [appointment.time.strftime("%H:%M:%S") for appointment in appointments]

    # Define all possible time slots in HH:mm:ss format
    all_times = ["10:00:00", "13:00:00", "15:00:00"]
    
    # Find available times
    available_times = [time for time in all_times if time not in booked_times]
    return available_times


@router.get("/appointment/{appointment_id}/school")
def get_school_name(appointment_id: int, db: Session = Depends(get_db)):
    try:
        school_name = get_school_name_by_appointment_id(db, appointment_id)
        return {"appointment_id": appointment_id, "school_name": school_name}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


def get_school_name_by_appointment_id(db: Session, appointment_id: int) -> str:
    """
    Retrieve the school name associated with the user in an appointment.

    :param db: SQLAlchemy session object
    :param appointment_id: ID of the appointment
    :return: School name associated with the user
    :raises: ValueError if the appointment, user, or school is not found
    """
    # Fetch the appointment to retrieve the user_id
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()

    if not appointment:
        raise ValueError("Appointment not found.")

    if not appointment.user_id:
        raise ValueError("User ID not found for this appointment.")

    # Fetch the user using the user_id
    user = db.query(User).filter(User.id == appointment.user_id).first()
    if not user or not user.school_id:
        raise ValueError("School ID not found for this user.")

    # Fetch the school using the school_id
    school = db.query(School).filter(School.id == user.school_id).first()
    if not school:
        raise ValueError("School not found for this user.")

    return school.name


@router.get("/admin/appointments", response_model=List[AppointmentResponse])
async def get_admin_appointments(
    db: db_dependency,
    current_user: dict = Depends(get_current_user),
):
    """
    Fetch all admin appointments with associated school names.
    """
    appointments = (
        db.query(
            Appointment.id,
            Appointment.user_id,
            Appointment.guide_id,
            Appointment.date,
            Appointment.time,
            Appointment.city,
            Appointment.visitors_number,
            Appointment.note,
            Appointment.status,
            Appointment.created_at,
            School.name.label("school_name"),  # Join to fetch school name
        )
        .join(User, User.id == Appointment.user_id)  # Join with User table
        .join(School, School.id == User.school_id)   # Join with School table
        .filter(
            Appointment.status.notin_(
                [AppointmentStatus.CANCELED, AppointmentStatus.COMPLETED]
            )
        )
        .all()
    )

    return appointments
