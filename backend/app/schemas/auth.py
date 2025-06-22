"""
GlucoVision Authentication Schemas
==================================

Pydantic schemas for authentication and authorization.
Provides data validation and serialization for auth endpoints.

Features:
- User registration and login validation
- Token response schemas
- Password security validation
- Professional error handling
"""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime


class TokenData(BaseModel):
    """Token data for JWT validation"""
    user_id: str
    token_type: str = "access"


class Token(BaseModel):
    """Token response schema"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class TokenRefresh(BaseModel):
    """Token refresh request schema"""
    refresh_token: str


class UserLogin(BaseModel):
    """User login request schema"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password")
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword123"
            }
        }


class UserRegister(BaseModel):
    """User registration request schema"""
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password")
    confirm_password: str = Field(..., description="Password confirmation")
    first_name: str = Field(..., min_length=1, max_length=50, description="First name")
    last_name: str = Field(..., min_length=1, max_length=50, description="Last name")
    
    @validator("confirm_password")
    def passwords_match(cls, v, values):
        """Validate that passwords match"""
        if "password" in values and v != values["password"]:
            raise ValueError("Passwords do not match")
        return v
    
    @validator("password")
    def validate_password_strength(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        
        has_upper = any(c.isupper() for c in v)
        has_lower = any(c.islower() for c in v)
        has_digit = any(c.isdigit() for c in v)
        
        if not (has_upper and has_lower and has_digit):
            raise ValueError("Password must contain uppercase, lowercase, and numeric characters")
        
        return v
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "newuser@example.com",
                "password": "SecurePass123",
                "confirm_password": "SecurePass123",
                "first_name": "John",
                "last_name": "Doe"
            }
        }


class PasswordResetRequest(BaseModel):
    """Password reset request schema"""
    email: EmailStr = Field(..., description="User email address")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com"
            }
        }


class PasswordResetVerify(BaseModel):
    """Password reset verification schema"""
    email: EmailStr = Field(..., description="User email address")
    verification_code: str = Field(..., min_length=6, max_length=6, description="6-digit verification code")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "verification_code": "123456"
            }
        }


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation schema"""
    token: str = Field(..., description="Password reset token")
    new_password: str = Field(..., min_length=8, description="New password")
    confirm_password: str = Field(..., description="Password confirmation")

    @validator("confirm_password")
    def passwords_match(cls, v, values):
        """Validate that passwords match"""
        if "new_password" in values and v != values["new_password"]:
            raise ValueError("Passwords do not match")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "token": "abc123def456",
                "new_password": "newpassword123",
                "confirm_password": "newpassword123"
            }
        }


class PasswordResetResponse(BaseModel):
    """Password reset response schema"""
    message: str
    email: Optional[str] = None
    token: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "message": "Verification code sent to your email",
                "email": "user@example.com"
            }
        }


class PasswordChange(BaseModel):
    """Password change schema"""
    current_password: str = Field(..., description="Current password")
    new_password: str = Field(..., min_length=8, description="New password")
    confirm_password: str = Field(..., description="Password confirmation")
    
    @validator("confirm_password")
    def passwords_match(cls, v, values):
        """Validate that passwords match"""
        if "new_password" in values and v != values["new_password"]:
            raise ValueError("Passwords do not match")
        return v
    
    @validator("new_password")
    def validate_password_strength(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        
        has_upper = any(c.isupper() for c in v)
        has_lower = any(c.islower() for c in v)
        has_digit = any(c.isdigit() for c in v)
        
        if not (has_upper and has_lower and has_digit):
            raise ValueError("Password must contain uppercase, lowercase, and numeric characters")
        
        return v


class AuthResponse(BaseModel):
    """Authentication response schema"""
    message: str
    user: dict
    tokens: Token
    
    class Config:
        json_schema_extra = {
            "example": {
                "message": "Login successful",
                "user": {
                    "id": "user-uuid",
                    "email": "user@example.com",
                    "first_name": "John",
                    "last_name": "Doe",
                    "has_completed_onboarding": False
                },
                "tokens": {
                    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                    "token_type": "bearer",
                    "expires_in": 1800
                }
            }
        }


class EmailVerificationRequest(BaseModel):
    """Email verification request schema"""
    token: str = Field(..., description="Email verification token")

    class Config:
        json_schema_extra = {
            "example": {
                "token": "abc123def456ghi789"
            }
        }


class EmailVerificationResponse(BaseModel):
    """Email verification response schema"""
    message: str
    user_verified: bool = False

    class Config:
        json_schema_extra = {
            "example": {
                "message": "Email verified successfully",
                "user_verified": True
            }
        }


class ResendVerificationRequest(BaseModel):
    """Resend verification email request schema"""
    email: EmailStr = Field(..., description="User email address")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com"
            }
        }


class LogoutResponse(BaseModel):
    """Logout response schema"""
    message: str = "Logout successful"

    class Config:
        json_schema_extra = {
            "example": {
                "message": "Logout successful"
            }
        }
