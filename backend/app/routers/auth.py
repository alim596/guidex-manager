from datetime import timedelta, datetime, timezone
from random import randint
from typing import Annotated
from fastapi import APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from app.database import  SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy import event
from app.models import User, OTP
from fastapi import HTTPException, Depends, status
from jose import jwt, JWTError
from passlib.context import CryptContext
from typing import Optional
from app.utils.email import send_email




router = APIRouter(
    prefix='/auth',
    tags=['auth']
)


oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/login")
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated="auto")

SECRET_KEY = "91ab6d6051805a8a1bf2f65dd1c5bfbcb198cffe492808928c723002a779d2a9"
ALGORRITHM = "HS256"
OTP_EXPIRATION_MINUTES = 5  # OTP validity duration


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

class CreateUserRequest(BaseModel):
    user_email: EmailStr
    role: str
    name: str
    school_id: Optional[int] = None
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str
    user_email: str

class SendOtpRequest(BaseModel):
    email: EmailStr

class ValidateOtpRequest(BaseModel):
    email: EmailStr
    otp: str



class UserUpdateRequest(BaseModel):
    name: Optional[str] = None
    user_email: Optional[EmailStr] = None
    password: Optional[str] = None


class UserUpdateResponse(BaseModel):
    message: str
    updated_user: dict



        
    
@router.post("/register", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user: CreateUserRequest):
    # Check if the email already exists in the database
    existing_user = db.query(User).filter(User.user_email == create_user.user_email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists."
        )
    #Otherwise create a new user
    db_user = User(
        user_email= create_user.user_email,
        name= create_user.name,
        role= create_user.role,
        school_id= create_user.school_id,
        hashed_password= bcrypt_context.hash(create_user.password)
    )

    db.add(db_user)
    db.commit()
    return{"User Succesfully Registered"}


def authenticate_user(user_email: str, password: str, db):
    user = db.query(User).filter(User.user_email == user_email).first()
    #if there is no user return false
    if not user:
        return False

    #if there password is wrong also return false
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    
    #if user is authenticated return user
    return user
    

def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    expires = datetime.now(timezone.utc) + expires_delta
    encode = {
        'sub': username,
        'user_id': user_id,
        'exp': expires
    }
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORRITHM)



#This function is to decode a jwt and get the username with user_id
async def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try: 
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORRITHM])
        username = payload.get('sub')
        user_id = payload.get('user_id')
        #in case if the user does not exist in the given jwt
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="JWT malformed1")
        
        return {"username" : username, "user_id": user_id}
    
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="JWT malformed2")
    


@router.post("/login", status_code=status.HTTP_200_OK, response_model=LoginResponse)
async def sign_in_for_access_token(db: db_dependency, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    
    valid_user = authenticate_user(form_data.username, form_data.password, db)

    if not valid_user:
        raise HTTPException(status_code= status.HTTP_401_UNAUTHORIZED)
    
    token = create_access_token(valid_user.name, valid_user.id, timedelta(minutes=30))
    return {'access_token': token, 'token_type' : 'bearer', 'role': valid_user.role, 'name' : valid_user.name, 'user_email': valid_user.user_email}
        

@router.get("/auth/get_user")
async def get_user():
    return {"current_user" : "Zesty Timo"}


#---------------------------------------------------Below code is for forget password logic--------------------------------------

def generate_otp() -> str:
    """Generate a 6-digit OTP."""
    return f"{randint(100000, 999999)}"

@router.post("/send_otp", status_code=status.HTTP_200_OK)
async def send_otp (request: SendOtpRequest, db: db_dependency):
    """Send OTP to a user's email."""
    user = db.query(User).filter(User.user_email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    otp = generate_otp()
    otp_entry = OTP(
        email=user.user_email,
        otp=otp,
        created_at=datetime.utcnow()
    )

    # Store OTP in the database (replace any existing OTP for the email)
    db.query(OTP).filter(OTP.email == user.user_email).delete()
    db.add(otp_entry)
    db.commit()

    # Send the OTP via email
    subject = "Your OTP Code"
    message = f"Your OTP is {otp}. It is valid for {OTP_EXPIRATION_MINUTES} minutes."
    await send_email(subject=subject, recipients=[user.user_email], body=message)
    return {"message": "OTP sent successfully"}


@router.post("/verify_otp", status_code=status.HTTP_200_OK)
async def validate_otp(request: ValidateOtpRequest, db: db_dependency):
    """Validate the provided OTP for a user."""
    otp_entry = db.query(OTP).filter(OTP.email == request.email).first()
    if not otp_entry:
        raise HTTPException(status_code=404, detail="OTP not found")

    # Check OTP expiration
    if datetime.utcnow() > otp_entry.created_at + timedelta(minutes=OTP_EXPIRATION_MINUTES):
        db.query(OTP).filter(OTP.email == request.email).delete()
        db.commit()
        raise HTTPException(status_code=400, detail="OTP expired")

    # Validate OTP
    if otp_entry.otp != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    # OTP is valid
    db.query(OTP).filter(OTP.email == request.email).delete()  # Clean up used OTP
    db.commit()

    return {"message": "OTP validated successfully"}



@router.patch("/update_user", response_model=UserUpdateResponse)
async def update_user(
    updates: UserUpdateRequest,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["user_id"]
    
    # Validate updates
    if not updates.model_dump(exclude_unset=True):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided to update."
        )
    
    # Fetch user from database
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    # Prepare updates
    update_data = updates.model_dump(exclude_unset=True)

    # Check if password is being updated
    if "password" in update_data:
        hashed_password = bcrypt_context.hash(update_data["password"])
        user.hashed_password = hashed_password
        update_data.pop("password")
        update_data["hashed_passord"] = hashed_password
    
    for key, value in update_data.items():
        setattr(user, key, value)

    # Mark the object as modified (optional but explicit)
    db.add(user)

    # Commit changes
    db.commit()


    return UserUpdateResponse(
        message="User updated successfully.",
        updated_user={
            "user_id": user.id,
            "name": user.name,
            "user_email": user.user_email,
            "role": user.role,
            "school_id": user.school_id
        }
    )

class ResetPassword(BaseModel):
    user_email : EmailStr
    new_password : str


@router.patch("/reset_password", status_code=status.HTTP_202_ACCEPTED)
async def reset_password(db:db_dependency, request_model : ResetPassword):
    user = db.query(User).filter(User.user_email == request_model.user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    hashed_new_password = bcrypt_context.hash(request_model.new_password)
    user.hashed_password = hashed_new_password

    db.add(user)
    db.commit()

    return {"message" : "Password reset was succesfull"}


#--------------------------------------------------------------- Below code is for admin initialization--------------------------------------- 


# Function to create admin user (explicitly passing the DB session)
def create_admin_user(db: Session):
    # Check if an admin user already exists
    admin_user = db.query(User).filter(User.role == "admin").first()
    if not admin_user:
        # Create the admin user
        admin_user = User(
            name="Admin",
            user_email="admin@example.com",
            role="admin",
            hashed_password=bcrypt_context.hash("abcd1234"),
            school_id=None,
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created.")
    else:
        print("Admin user already exists.")

#-----------------------------------------------------------Below code is for populating db with the mock visitor and mock guide--------------------
#-----------------------------------------------------------it should be delete prior deployment----------------------------------------------------

def create_mock_users(db: Session):
    visitor = db.query(User).filter(User.role == "visitor").first()
    guide = db.query(User).filter(User.role == "guide").first()

    if not visitor and not guide:
        visitor = User(
            name = "VisitorExample",
            user_email = "visitor@example.com",
            role = "visitor",
            hashed_password=bcrypt_context.hash("abcd1234"),
            school_id = 1
        )

        guide = User(
            name = "GuideExample",
            user_email = "guide@example.com",
            role = "guide",
            hashed_password=bcrypt_context.hash("abcd1234"),
            school_id = None
        )

        db.add(visitor)
        db.add(guide)
        db.commit()
        print("Mock visitor and guide users created")
    else:
        print("Users already exists.")



# Event listener for after creating the table
def after_create_listener(target, connection, **kwargs):
    # Create a session from the sessionmaker
    db = SessionLocal()
    create_admin_user(db)
    create_mock_users(db)
    db.close()

# Attach the event listener
event.listen(User.__table__, 'after_create', after_create_listener)