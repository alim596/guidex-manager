from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Annotated
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.routers.auth import get_current_user  # Import JWT auth dependency
from app.models import Notification, NotificationCreate, User, NotificationResponse, CustomNotification
from app.utils.email import send_email

# Create the APIRouter instance
router = APIRouter(
    prefix="/notifications",
    tags=["notifications"]
)

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]



@router.get("/hi", response_model=List[NotificationResponse])
async def get_notifications(
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    print("Current User:", current_user)
    notifications = db.query(Notification).filter(
        Notification.recipient_id == current_user["user_id"]
    ).order_by(Notification.created_at.desc()).all()
    return [NotificationResponse.from_orm(notification) for notification in notifications]



@router.put("/{notification_id}/read")
async def mark_notification_as_read(
    db: db_dependency,
    notification_id: int,
    current_user: dict = Depends(get_current_user)
):
    """
    Mark a specific notification as read for the authenticated user.
    """
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.recipient_id == current_user["user_id"]
    ).first()

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found.")

    notification.is_read = True
    db.commit()
    return {"detail": "Notification marked as read."}


@router.put("/read-all")
async def mark_all_notifications_as_read(
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """
    Mark all notifications as read for the authenticated user.
    """
    notifications = db.query(Notification).filter(
        Notification.recipient_id == current_user["user_id"],
        Notification.is_read == False
    ).all()

    for notification in notifications:
        notification.is_read = True

    db.commit()
    return {"detail": f"{len(notifications)} notifications marked as read."}


@router.post("/notifications", response_model=NotificationResponse)
async def create_notification(
    notification: NotificationCreate,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a notification for a specific user and send an email.
    """

    # Create the notification in the database
    new_notification = Notification(
        recipient_id=notification.recipient_id,
        appointment_id=notification.appointment_id,
        message=notification.message,
        type=notification.type,
    )

    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)

    # Fetch the recipient's email (assuming a User model with an email field)
    recipient = db.query(User).filter(User.id == notification.recipient_id).first()
    if not recipient or not recipient.user_email:
        raise HTTPException(status_code=404, detail="Recipient email not found.")

    # Use NotificationCreate details for email subject and body
    email_subject = f"Notification: {notification.type.capitalize()}"
    email_body = f"""
    <p>Hello {recipient.name},</p>
    <p>You have a new notification:</p>
    <p>{notification.message}</p>
    <p>Thank you,<br>Guidex Team</p>
    """
    try:
        await send_email(email_subject, [recipient.user_email], email_body)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

    return new_notification

@router.delete("/{notification_id}")
async def delete_notification(
    db: db_dependency,
    notification_id: int,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a specific notification for the authenticated user.
    """
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        #Notification.recipient_id == current_user["user_id"]
    ).first()

    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found.")

    db.delete(notification)
    db.commit()
    return {"detail": "Notification deleted successfully."}


@router.get("/filter", response_model=List[NotificationResponse])
async def filter_notifications(
    db: db_dependency,
    type: str | None = None,
    is_read: bool | None = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Filter notifications by type or read status.
    """
    query = db.query(Notification).filter(Notification.recipient_id == current_user["user_id"])

    if type:
        query = query.filter(Notification.type == type)

    if is_read is not None:
        query = query.filter(Notification.is_read == is_read)

    notifications = query.order_by(Notification.created_at.desc()).all()
    return notifications


@router.post("/test-email")
async def test_email_endpoint():
    try:
        await send_email("Test", ["3boodkn@gmail.com"], "<p>Test email</p>")
        return {"detail": "Email sent successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")


@router.post("/notify-admins")
async def notify_admins(
    appointment_id: int,
    message: str,
    notification_type: str,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """
    Notify all admins about a new appointment.
    """
    admins = db.query(User).filter(User.role == "admin").all()

    if not admins:
        raise HTTPException(status_code=404, detail="No admins found.")

    notifications_created = []
    for admin in admins:
        # Create notification for each admin
        new_notification = Notification(
            recipient_id=admin.id,
            appointment_id=appointment_id,
            message=message,
            type=notification_type,
        )
        db.add(new_notification)
        db.commit()
        db.refresh(new_notification)
        notifications_created.append(new_notification)

        # Send email to each admin
        email_subject = f"Notification: {notification_type}"
        email_body = f"""
        <p>Hello {admin.name},</p>
        <p>You have a new notification:</p>
        <p>{message}</p>
        <p>Thank you,<br>Guidex Team</p>
        """
        try:
            await send_email(email_subject, [admin.user_email], email_body)
        except Exception as e:
            print(f"Failed to send email to admin {admin.id}: {e}")

    return {"detail": f"Notifications sent to {len(notifications_created)} admins."}


@router.post("/notify-guides")
async def notify_guides(
    message: str,
    notification_type: str,
    db: db_dependency,
    appointment_id: int | None = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Notify all guides about a new appointment.
    """
    guides = db.query(User).filter(User.role == "guide").all()

    if not guides:
        raise HTTPException(status_code=404, detail="No guides found.")

    notifications_created = []
    for guide in guides:
        # Create notification for each guide
        new_notification = Notification(
            recipient_id=guide.id,
            appointment_id=appointment_id,
            message=message,
            type=notification_type,
        )
        db.add(new_notification)
        db.commit()
        db.refresh(new_notification)
        notifications_created.append(new_notification)

        # Send email to each guide
        email_subject = f"Notification: {notification_type}"
        email_body = f"""
        <p>Hello {guide.name},</p>
        <p>You have a new notification:</p>
        <p>{message}</p>
        <p>Thank you,<br>Guidex Team</p>
        """
        try:
            await send_email(email_subject, [guide.user_email], email_body)
        except Exception as e:
            print(f"Failed to send email to guide {guide.id}: {e}")

    return {"detail": f"Notifications sent to {len(notifications_created)} guides."}


@router.post("/notify-user")
async def notify_user(
    recipient_id: int,
    appointment_id: int,
    message: str,
    notification_type: str,
    db: db_dependency
):
    """
    Notify a specific user about an event and send an email.
    """
    # Fetch the recipient's details
    recipient = db.query(User).filter(User.id == recipient_id).first()
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found.")

    # Create a notification
    new_notification = Notification(
        recipient_id=recipient_id,
        appointment_id=appointment_id,
        message=message,
        type=notification_type,
    )
    db.add(new_notification)
    db.commit()
    db.refresh(new_notification)

    # Send email to the user
    email_subject = f"Notification: {notification_type}"
    email_body = f"""
    <p>Hello {recipient.name},</p>
    <p>{message}</p>
    <p>Thank you,<br>Guidex Team</p>
    """
    try:
        await send_email(email_subject, [recipient.user_email], email_body)
    except Exception as e:
        print(f"Failed to send email to user {recipient_id}: {e}")

    return {"detail": f"Notification sent to user {recipient_id}."}


@router.post("/custom-guide-notification")
async def create_custom_guide_notification(
    payload: CustomNotification,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """
    Allow admins to create custom notifications for all guides.
    """
    user_id = current_user['user_id']
    user = db.query(User).filter(User.id == user_id and User.role == "admin").first()
    if user == None:
        raise HTTPException(status_code=403, detail="Only admins can send custom notifications.")


    # Use the notify_guides function
    await notify_guides(
        appointment_id=None,  # No appointment associated
        message=payload.message,
        notification_type=payload.notification_type,
        db=db
    )

    return {"detail": "Custom notifications sent to all guides."}
