from sqlalchemy import  String, Column,String, Integer,DateTime, Boolean
from src.utils.db import Base
 
class UserModel(Base):
    __tablename__ = "user_table"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    user_name = Column(String, nullable=False, unique=True, index=True)
    email = Column(String,unique=True, index=True)
    hash_password = Column(String, nullable=False)

    