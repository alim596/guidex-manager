from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

MAIL_CONFIG = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS") == "True",  # Use STARTTLS
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS") == "True",    # Use SSL/TLS
    USE_CREDENTIALS=os.getenv("USE_CREDENTIALS") == "True",
)

async def send_email(subject: str, recipients: list, body: str):
    """
    Send an email to the specified recipients.
    """
    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        body=body,
        subtype="html",  # Use "plain" for plain text emails
    )

    fast_mail = FastMail(MAIL_CONFIG)
    await fast_mail.send_message(message)



# FastAPI router for email functionality
router = APIRouter()

# Request body schema for the email endpoint
class EmailRequest(BaseModel):
    sender_name: str
    sender_email: EmailStr
    message: str


@router.post("/contact")
async def send_contact_email(email_request: EmailRequest):
    """
    Endpoint to send contact emails to a fixed recipient.
    """
    try:
        # Construct the email subject and body
        subject = f"New Contact Form Message from {email_request.sender_name}"
        body = (
            f"<p><strong>From:</strong> {email_request.sender_name} ({email_request.sender_email})</p>"
            f"<p><strong>Message:</strong></p>"
            f"<p>{email_request.message}</p>"
        )

        # Send the email to the fixed recipient
        await send_email(subject, ["bilinfo@bilkent.edu.tr"], body)

        return {"message": "Email sent successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")
