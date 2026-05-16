from pydantic import BaseModel

class UserSchema(BaseModel):
    name: str
    user_name: str   # ✅ ADD THIS
    email: str
    password: str


class UserResponseSchema(BaseModel):
    id: int
    name: str
    user_name: str   # ✅ ADD THIS
    email: str


class LoginSchema(BaseModel):
    user_name: str
    password: str