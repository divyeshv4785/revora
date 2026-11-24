from pydantic import BaseModel, EmailStr
from typing import Optional

class OTPRequest(BaseModel):
    phone_number: str

class OTPVerify(BaseModel):
    phone_number: str
    otp_code: str
    role: Optional[str] = "buyer"

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    role: str

class UserLogin(BaseModel):
    email_or_phone: str
    password: str

class UserCreate(BaseModel):
    display_name: str
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    password: str
    role: str = "buyer" # buyer, seller, dealer
