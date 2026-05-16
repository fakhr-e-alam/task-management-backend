from src.users.dtos import UserSchema , LoginSchema, UserResponseSchema 
from sqlalchemy.orm import Session
from fastapi import HTTPException ,status,Request
from src.users.models import UserModel
from pwdlib import PasswordHash
import jwt
from src.utils.settings import settings
from datetime import datetime, timedelta
from jwt.exceptions import InvalidTokenError

# hash password
password_hash = PasswordHash.recommended()

def get_password_hash(password: str):
    return password_hash.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return password_hash.verify(plain_password, hashed_password)

# validation for user registration
def register(body: UserSchema, db: Session):

    # Check email
    is_user = db.query(UserModel).filter(UserModel.email == body.email).first()
    if is_user:
        raise HTTPException(status_code=400, detail="User email already exists")

    # Check username
    is_user_name = db.query(UserModel).filter(UserModel.user_name == body.user_name).first()
    if is_user_name:
        raise HTTPException(status_code=400, detail="User name already exists")

    # Hash password
    hash_password = get_password_hash(body.password)

    # Create new user
    new_user = UserModel(
        name=body.name,
        user_name=body.user_name,
        email=body.email,
        hash_password=hash_password
    )




    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user



def Login_user(body: LoginSchema, db: Session):
    #Verify username
    user = db.query(UserModel).filter(UserModel.user_name == body.user_name).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="you entered wrong username")
     # Verify password
    if not verify_password(body.password, user.hash_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")

    exp_time = datetime.utcnow() + timedelta(minutes=settings.EXP_TIME)
    
    token=jwt.encode({"id": user.id,"exp": exp_time}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    

    return {"access_token": token, "token_type": "bearer"}

#token se
def is_authenticated(request:Request,db: Session):
    try:
        token = request.headers.get("authorization")
        if not token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are unauthorized")
        token = token.split(" ")[-1]
        data=jwt.decode(token, settings.SECRET_KEY, settings.ALGORITHM)
        user_id=data.get("id")
        exp_time=data.get("exp")
        current_time = datetime.now().timestamp()
        if exp_time > exp_time:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are unauthorized")
        user = db.query(UserModel).filter(UserModel.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are unauthorized")
        return user
    except InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="You are unauthorized")