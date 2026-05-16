from fastapi import Request, HTTPException, status, Depends
from sqlalchemy.orm import Session
from src.utils.settings import settings
from src.users.models import UserModel
from src.utils.db import get_db
from datetime import datetime
import jwt
from jwt.exceptions import InvalidTokenError


def is_authenticated(request: Request, db: Session = Depends(get_db)):
    try:
        token = request.headers.get("authorization")

        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="You are unauthorized"
            )

        token = token.split(" ")[-1]

        data = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id = data.get("id")
        exp_time = data.get("exp")

        current_time = datetime.now().timestamp()

        if current_time > exp_time:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired"
            )

        user = db.query(UserModel).filter(UserModel.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )

        return user

    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )