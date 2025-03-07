from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Annotated
from app.database import get_db
from app.models import Feedback, User, Appointment
from datetime import datetime
from pydantic import BaseModel
from app.routers.auth import get_current_user  # Add this import

router = APIRouter()

class FeedbackCreate(BaseModel):
    rating: int
    comment: str
    appointment_id: int | None = None

class FeedbackResponse(BaseModel):
    id: int
    rating: int
    comment: str
    created_at: datetime
    user_id: int
    appointment_id: int | None
    
    class Config:
        from_attributes = True

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post("/submit", response_model=FeedbackResponse)
async def submit_feedback(
    feedback: FeedbackCreate,
    db: db_dependency,
    current_user: user_dependency
):
    # Validate the appointment_id if provided
    if feedback.appointment_id is not None:
        appointment_exists = db.query(Appointment).filter(Appointment.id == feedback.appointment_id).first()
        if not appointment_exists:
            raise HTTPException(status_code=400, detail="Invalid appointment_id")

    # Create the feedback
    db_feedback = Feedback(
        user_id=current_user['user_id'],
        rating=feedback.rating,
        comment=feedback.comment,
        appointment_id=feedback.appointment_id  # This will be None if not provided
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.get("/list", response_model=List[FeedbackResponse])
async def get_feedback_list(
    db: db_dependency,
    current_user: user_dependency
):
    user = db.query(User).filter(User.id == current_user['user_id']).first()
    if not user or user.role not in ["admin", "guide"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    feedbacks = db.query(Feedback).all()
    return feedbacks