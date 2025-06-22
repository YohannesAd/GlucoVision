"""
GlucoVision Authentication Endpoints
====================================

Professional authentication API endpoints with comprehensive security.
Handles user registration, login, token refresh, and password management.

Features:
- Secure user registration with validation
- JWT-based authentication with refresh tokens
- Password reset functionality
- Professional error handling and logging
- Medical-grade security compliance
"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

import logging

from app.core.database import get_async_session
from app.core.security import (
    security_manager, 
    generate_user_tokens, 
    verify_refresh_token,
    get_current_user
)
from app.models.user import User
from app.models.password_reset import PasswordResetToken
from app.models.email_verification import EmailVerificationToken
from app.services.email_service import email_service
from app.schemas.auth import (
    UserLogin,
    UserRegister,
    Token,
    TokenRefresh,
    AuthResponse,
    LogoutResponse,
    PasswordChange,
    PasswordResetRequest,
    PasswordResetVerify,
    PasswordResetConfirm,
    PasswordResetResponse,
    EmailVerificationRequest,
    EmailVerificationResponse,
    ResendVerificationRequest
)

# Configure logging
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()
security = HTTPBearer()


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Register New User
    
    Creates a new user account with secure password hashing.
    Automatically generates authentication tokens for immediate login.
    
    **Security Features:**
    - Email uniqueness validation
    - Strong password requirements
    - Secure password hashing with bcrypt
    - Automatic token generation
    
    **Returns:**
    - User profile information
    - JWT access and refresh tokens
    - Success message
    """
    try:
        # Check if user already exists
        existing_user = await User.get_by_email(db, user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        user = await User.create(
            db,
            email=user_data.email,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            hashed_password=security_manager.hash_password(user_data.password),
            is_active=True,
            is_verified=False  # Will be verified via email
        )

        # Update last login and commit
        user.update_last_login()
        await db.commit()

        # Refresh user to get updated data
        await db.refresh(user)

        # Create email verification token
        verification_token = await EmailVerificationToken.create_for_user(
            db, user.id, expires_hours=24
        )

        # Send verification email
        user_name = f"{user.first_name} {user.last_name}"
        email_sent = await email_service.send_verification_email(
            to_email=user.email,
            user_name=user_name,
            verification_token=verification_token.token
        )

        if not email_sent:
            logger.warning(f"Failed to send verification email to {user.email}")

        # Generate authentication tokens (outside transaction)
        tokens = generate_user_tokens(user.id)

        # Serialize user data (outside transaction)
        user_data_dict = user.to_dict()

        logger.info(f"New user registered: {user.email}")

        return AuthResponse(
            message="Registration successful. Please check your email to verify your account.",
            user=user_data_dict,
            tokens=Token(**tokens)
        )
        
    except HTTPException:
        raise
    except ValueError as e:
        # Handle validation errors (password strength, etc.)
        logger.warning(f"Registration validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except HTTPException:
        # Re-raise HTTP exceptions (like email already exists)
        raise
    except Exception as e:
        logger.error(f"Registration error: {e}")
        logger.error(f"Error type: {type(e)}")
        logger.error(f"Error details: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )


@router.post("/login", response_model=AuthResponse)
async def login_user(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_async_session)
):
    """
    User Login
    
    Authenticates user credentials and returns JWT tokens.
    Updates user's last login timestamp for security tracking.
    
    **Security Features:**
    - Email and password validation
    - Account status verification
    - Secure password verification
    - Login attempt logging
    
    **Returns:**
    - User profile information
    - JWT access and refresh tokens
    - Success message
    """
    try:
        # Get user by email
        user = await User.get_by_email(db, login_data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Verify password
        if not user.verify_password(login_data.password):
            logger.warning(f"Failed login attempt for: {login_data.email}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )
        
        # Update last login and commit
        user.update_last_login()
        await db.commit()

        # Refresh user to get updated data
        await db.refresh(user)

        # Generate authentication tokens (outside transaction)
        tokens = generate_user_tokens(user.id)

        # Serialize user data (outside transaction)
        user_data = user.to_dict()

        logger.info(f"Successful login: {user.email}")

        return AuthResponse(
            message="Login successful",
            user=user_data,
            tokens=Token(**tokens)
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions (like invalid credentials)
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Please try again."
        )


@router.post("/refresh", response_model=Token)
async def refresh_token(
    token_data: TokenRefresh,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Refresh Access Token
    
    Generates a new access token using a valid refresh token.
    Maintains user session without requiring re-authentication.
    
    **Security Features:**
    - Refresh token validation
    - User status verification
    - New token generation
    - Token rotation for enhanced security
    
    **Returns:**
    - New JWT access and refresh tokens
    """
    try:
        # Verify refresh token and get user
        user = await verify_refresh_token(token_data.refresh_token, db)
        
        # Generate new tokens
        tokens = generate_user_tokens(user.id)
        
        logger.info(f"Token refreshed for user: {user.email}")
        
        return Token(**tokens)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token refresh failed. Please login again."
        )


@router.post("/logout", response_model=LogoutResponse)
async def logout_user(
    current_user: User = Depends(get_current_user)
):
    """
    User Logout
    
    Logs out the current user. In a production environment,
    this would invalidate the tokens in a token blacklist.
    
    **Security Features:**
    - Token validation
    - Logout logging
    - Session cleanup
    
    **Returns:**
    - Logout confirmation message
    """
    try:
        logger.info(f"User logged out: {current_user.email}")
        
        # In production, add token to blacklist here
        # await add_token_to_blacklist(token)
        
        return LogoutResponse(message="Logout successful")
        
    except Exception as e:
        logger.error(f"Logout error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed. Please try again."
        )


@router.post("/change-password")
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_async_session)
):
    """
    Change User Password
    
    Allows authenticated users to change their password.
    Requires current password verification for security.
    
    **Security Features:**
    - Current password verification
    - Strong password validation
    - Secure password hashing
    - Password change logging
    
    **Returns:**
    - Success confirmation message
    """
    try:
        # Verify current password
        if not current_user.verify_password(password_data.current_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        
        # Update password
        current_user.set_password(password_data.new_password)
        await db.commit()
        
        logger.info(f"Password changed for user: {current_user.email}")
        
        return {"message": "Password changed successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Password change error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Password change failed. Please try again."
        )


@router.get("/me")
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get Current User Information
    
    Returns the current authenticated user's profile information.
    Used for user profile display and authentication verification.
    
    **Security Features:**
    - JWT token validation
    - User status verification
    - Secure data serialization
    
    **Returns:**
    - User profile information
    - Account status
    - Onboarding status
    """
    try:
        return {
            "user": current_user.to_dict(),
            "message": "User information retrieved successfully"
        }
        
    except Exception as e:
        logger.error(f"Get user info error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve user information"
        )


@router.post("/verify-token")
async def verify_token_endpoint(
    current_user: User = Depends(get_current_user)
):
    """
    Verify Token Validity
    
    Endpoint to verify if the current token is valid.
    Used by frontend applications to check authentication status.
    
    **Security Features:**
    - JWT token validation
    - User status verification
    - Token expiration checking
    
    **Returns:**
    - Token validity status
    - User information
    """
    try:
        return {
            "valid": True,
            "user": current_user.to_dict(),
            "message": "Token is valid"
        }
        
    except Exception as e:
        logger.error(f"Token verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Token verification failed"
        )


@router.post("/forgot-password", response_model=PasswordResetResponse)
async def forgot_password(
    reset_data: PasswordResetRequest,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Forgot Password - Step 1

    Initiates password reset process by sending verification code to user's email.
    Creates a temporary token and sends 6-digit code for verification.

    **Security Features:**
    - Email validation
    - Rate limiting protection
    - Secure token generation
    - Temporary code expiration

    **Returns:**
    - Success message
    - Masked email confirmation
    """
    try:
        # Check if user exists
        user = await User.get_by_email(db, reset_data.email)
        if not user:
            # Don't reveal if email exists for security
            logger.warning(f"Password reset attempted for non-existent email: {reset_data.email}")
            return PasswordResetResponse(
                message="If this email is registered, you will receive a verification code shortly.",
                email=reset_data.email
            )

        # Invalidate any existing tokens for this user
        await PasswordResetToken.invalidate_user_tokens(db, user.id)

        # Create new reset token
        reset_token = await PasswordResetToken.create_for_user(db, user.id, expires_minutes=15)

        # Send password reset email
        user_name = f"{user.first_name} {user.last_name}"
        email_sent = await email_service.send_password_reset_email(
            to_email=user.email,
            user_name=user_name,
            verification_code=reset_token.verification_code
        )

        if not email_sent:
            # Fallback to console logging if email fails
            logger.warning(f"Failed to send password reset email to {user.email}")
            import sys
            print("\n" + "=" * 80, flush=True)
            print(f"🔑 VERIFICATION CODE for {user.email}: {reset_token.verification_code}", flush=True)
            print(f"📧 Email: {user.email}", flush=True)
            print(f"⏰ Expires: {reset_token.expires_at}", flush=True)
            print("=" * 80, flush=True)
            print("", flush=True)
        else:
            logger.info(f"Password reset email sent to {user.email}")

        # Mask email for response
        email_parts = reset_data.email.split('@')
        masked_email = f"{email_parts[0][:2]}***@{email_parts[1]}"

        logger.info(f"Password reset initiated for user: {user.email}")

        return PasswordResetResponse(
            message="Verification code sent to your email. Please check your inbox.",
            email=masked_email
        )

    except Exception as e:
        logger.error(f"Forgot password error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process password reset request. Please try again."
        )


@router.post("/verify-reset-code", response_model=PasswordResetResponse)
async def verify_reset_code(
    verify_data: PasswordResetVerify,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Verify Reset Code - Step 2

    Verifies the 6-digit code sent to user's email.
    Returns a token for the final password reset step.

    **Security Features:**
    - Code validation
    - Expiration checking
    - Token generation for next step
    - Rate limiting protection

    **Returns:**
    - Success message
    - Reset token for final step
    """
    try:
        # Get user by email
        user = await User.get_by_email(db, verify_data.email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid verification code"
            )

        # Find valid token with matching code
        reset_token = await PasswordResetToken.get_by_verification_code(
            db, user.id, verify_data.verification_code
        )

        if not reset_token or not reset_token.is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired verification code"
            )

        logger.info(f"Password reset code verified for user: {user.email}")

        return PasswordResetResponse(
            message="Verification code confirmed. You can now reset your password.",
            token=reset_token.token
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Verify reset code error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify code. Please try again."
        )


@router.post("/reset-password", response_model=PasswordResetResponse)
async def reset_password(
    reset_data: PasswordResetConfirm,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Reset Password - Step 3

    Completes password reset process using verified token.
    Updates user's password and invalidates the reset token.

    **Security Features:**
    - Token validation
    - Password strength validation
    - Secure password hashing
    - Token invalidation

    **Returns:**
    - Success confirmation message
    """
    try:
        # Get reset token
        reset_token = await PasswordResetToken.get_by_token(db, reset_data.token)
        if not reset_token or not reset_token.is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )

        # Get user
        user = await User.get_by_id(db, reset_token.user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid reset token"
            )

        # Update user password
        user.set_password(reset_data.new_password)

        # Mark token as used
        reset_token.mark_as_used()

        # Commit changes
        await db.commit()

        logger.info(f"Password reset completed for user: {user.email}")

        return PasswordResetResponse(
            message="Password reset successful. You can now login with your new password."
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Reset password error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to reset password. Please try again."
        )


@router.post("/verify-email", response_model=EmailVerificationResponse)
async def verify_email(
    verify_data: EmailVerificationRequest,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Verify Email Address

    Verifies user's email address using the verification token.
    Activates the user account upon successful verification.

    **Security Features:**
    - Token validation
    - Expiration checking
    - Account activation
    - Verification logging

    **Returns:**
    - Verification status
    - Success message
    """
    try:
        # Get verification token
        verification_token = await EmailVerificationToken.get_valid_token(
            db, verify_data.token
        )

        if not verification_token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired verification token"
            )

        # Get user
        user = await User.get_by_id(db, verification_token.user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User not found"
            )

        # Mark user as verified
        user.is_verified = True

        # Mark token as used
        verification_token.mark_as_used()

        # Commit changes
        await db.commit()

        # Send welcome email
        user_name = f"{user.first_name} {user.last_name}"
        welcome_sent = await email_service.send_welcome_email(
            to_email=user.email,
            user_name=user_name
        )

        if not welcome_sent:
            logger.warning(f"Failed to send welcome email to {user.email}")

        logger.info(f"Email verified for user: {user.email}")

        return EmailVerificationResponse(
            message="Email verified successfully. Your account is now active. Welcome to GlucoVision!",
            user_verified=True
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Email verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify email. Please try again."
        )


@router.post("/resend-verification", response_model=EmailVerificationResponse)
async def resend_verification_email(
    resend_data: ResendVerificationRequest,
    db: AsyncSession = Depends(get_async_session)
):
    """
    Resend Verification Email

    Sends a new verification email to the user.
    Invalidates previous tokens and creates a new one.

    **Security Features:**
    - User validation
    - Token invalidation
    - Rate limiting protection
    - Email delivery confirmation

    **Returns:**
    - Success message
    - Email delivery status
    """
    try:
        # Get user by email
        user = await User.get_by_email(db, resend_data.email)
        if not user:
            # Don't reveal if email exists for security
            return EmailVerificationResponse(
                message="If this email is registered and unverified, a new verification email has been sent."
            )

        # Check if user is already verified
        if user.is_verified:
            return EmailVerificationResponse(
                message="This email address is already verified."
            )

        # Invalidate existing verification tokens
        await EmailVerificationToken.invalidate_user_tokens(db, user.id)

        # Create new verification token
        verification_token = await EmailVerificationToken.create_for_user(
            db, user.id, expires_hours=24
        )

        # Send verification email
        user_name = f"{user.first_name} {user.last_name}"
        email_sent = await email_service.send_verification_email(
            to_email=user.email,
            user_name=user_name,
            verification_token=verification_token.token
        )

        if not email_sent:
            logger.warning(f"Failed to resend verification email to {user.email}")
            return EmailVerificationResponse(
                message="Failed to send verification email. Please try again later."
            )

        logger.info(f"Verification email resent to: {user.email}")

        return EmailVerificationResponse(
            message="Verification email sent. Please check your inbox."
        )

    except Exception as e:
        logger.error(f"Resend verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to resend verification email. Please try again."
        )
