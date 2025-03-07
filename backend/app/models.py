from sqlalchemy import Column, Integer, String, ForeignKey, Date, Time, Text, DateTime, Enum, Boolean
from app.database import Base
from sqlalchemy.orm import relationship
from datetime import date, time, datetime
from typing import Optional
from pydantic import BaseModel, Field
import enum


class AppointmentStatus(enum.Enum):
    CREATED = "created"       # Appointment created by user
    PENDING_ADMIN = "pending_admin"  # Pending admin approval
    APPROVED = "approved"     # Approved by admin
    ACCEPTED = "accepted"     # Accepted by a guide
    REJECTED = "rejected"     # Rejected by admin
    COMPLETED = "completed"   # Completed
    CANCELED = "canceled"     # Canceled (if applicable)


#Database tables
class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    user_email = Column(String(50), unique=True, nullable=False)
    role = Column(String(50), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    school_id = Column(Integer, ForeignKey("schools.id"), nullable=True)  # Link to school

    created_appointments = relationship("Appointment", foreign_keys="Appointment.user_id", back_populates="user")
    assigned_appointments = relationship("Appointment", foreign_keys="Appointment.guide_id", back_populates="guide")
    notifications = relationship("Notification", back_populates="recipient")
    feedbacks = relationship("Feedback", back_populates="user")  


class Appointment(Base):
    __tablename__ = "appointment"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    guide_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    date = Column(Date, nullable=False)
    time = Column(Time, nullable=False)
    city = Column(String(50), nullable=False)
    visitors_number = Column(Integer, nullable=False)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.CREATED, nullable=False)

    user = relationship("User", foreign_keys=[user_id])
    guide = relationship("User", foreign_keys=[guide_id])
    notifications = relationship("Notification", back_populates="appointment")
    feedbacks = relationship("Feedback", back_populates="appointment")  # Add this


class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    appointment_id = Column(Integer, ForeignKey("appointment.id"), nullable=True)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="feedbacks")
    appointment = relationship("Appointment", back_populates="feedbacks")

class OTP(Base):
    __tablename__ = "otp"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(50), nullable=False, index=True)
    otp = Column(String(6), nullable=False)
    created_at = Column(DateTime, nullable=False)




#pydantic models
class AppointmentCreateBase(BaseModel):
    date: date  # Appointment date
    time: time  # Appointment time
    visitors_number: int
    note: Optional[str] = None  # Optional note
    status: AppointmentStatus = AppointmentStatus.CREATED  # Default status

class UserBase(BaseModel):
    user_id: int
    name: str
    user_email: str
    role: str
    school_id: Optional[int] = None
    
class AppointmentBase(BaseModel):
    id: int
    date: date  # Appointment date
    time: time  # Appointment time
    city: str 
    visitors_number: int
    note: Optional[str] = None  # Optional note
    status: AppointmentStatus = AppointmentStatus.CREATED  # Default status

class AppointmentResponse(BaseModel):
    id: int
    user_id: int
    guide_id: Optional[int] = None
    date: date
    time: time
    city: str
    visitors_number: int
    note: Optional[str] = None
    status: AppointmentStatus
    created_at: datetime
    school_name: Optional[str] = None  # Add school_name

    class Config:
        orm_mode = True  # Enable ORM mode for seamless conversion from DB models


class AppointmentStatusUpdate(BaseModel):
    status: str

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)  # Unique notification ID
    recipient_id = Column(Integer, ForeignKey("user.id"), nullable=False)  # User to whom the notification belongs
    appointment_id = Column(Integer, ForeignKey("appointment.id"), nullable=True)  # Associated appointment, if any
    message = Column(Text, nullable=False)  # Notification message
    type = Column(String(50), nullable=False)  # Notification type (e.g., "admin", "guide", "user")
    is_read = Column(Boolean, default=False)  # Whether the notification is read
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)  # Creation timestamp

    # Relationships
    recipient = relationship("User", back_populates="notifications")
    appointment = relationship("Appointment", back_populates="notifications")


class NotificationCreate(BaseModel):
    recipient_id: int
    appointment_id: int | None = None
    message: str
    type: str

class NotificationResponse(BaseModel):
    id: int
    recipient_id: int
    appointment_id: Optional[int]  # Optional if nullable in the database
    message: str
    type: str
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes=True
    
class CustomNotification(BaseModel):
    message: str
    notification_type: str

# Add Schools Table
class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)  # School name
    city = Column(String(255), nullable=False)  # City where the school is located

    users = relationship("User", backref="school")
