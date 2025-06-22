"""
GlucoVision Email Service
========================

Professional email service for user notifications and communications.
Handles SMTP configuration, email templates, and secure email delivery.

Features:
- SMTP email sending with TLS/SSL support
- Professional HTML email templates
- Email verification and password reset
- Error handling and logging
- Medical-grade security compliance
"""

import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from typing import List, Optional, Dict, Any
import logging
from pathlib import Path
import asyncio
from concurrent.futures import ThreadPoolExecutor

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    """
    Professional Email Service
    
    Handles all email communications for the GlucoVision app.
    Provides secure SMTP delivery with professional templates.
    """
    
    def __init__(self):
        """Initialize email service with SMTP configuration"""
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.smtp_tls = settings.SMTP_TLS
        self.smtp_ssl = settings.SMTP_SSL
        self.from_email = settings.FROM_EMAIL
        self.from_name = settings.FROM_NAME
        self.enabled = settings.ENABLE_EMAIL
        
        # Thread pool for async email sending
        self.executor = ThreadPoolExecutor(max_workers=3)
        
        if not self.enabled:
            logger.warning("Email service is disabled. Set ENABLE_EMAIL=true to enable.")
        elif not self._validate_config():
            logger.error("Email service configuration is incomplete.")
            self.enabled = False
    
    def _validate_config(self) -> bool:
        """Validate email configuration"""
        required_fields = [
            self.smtp_host,
            self.smtp_username,
            self.smtp_password,
            self.from_email
        ]
        return all(field for field in required_fields)
    
    def _create_smtp_connection(self) -> smtplib.SMTP:
        """Create and configure SMTP connection"""
        try:
            if self.smtp_ssl:
                # Use SSL connection
                context = ssl.create_default_context()
                server = smtplib.SMTP_SSL(self.smtp_host, self.smtp_port, context=context)
            else:
                # Use regular connection with optional TLS
                server = smtplib.SMTP(self.smtp_host, self.smtp_port)
                if self.smtp_tls:
                    server.starttls()
            
            # Login to server
            server.login(self.smtp_username, self.smtp_password)
            return server
            
        except Exception as e:
            logger.error(f"Failed to create SMTP connection: {e}")
            raise
    
    def _send_email_sync(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None,
        attachments: Optional[List[Dict[str, Any]]] = None
    ) -> bool:
        """
        Send email synchronously
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML email content
            text_content: Plain text content (optional)
            attachments: List of attachments (optional)
            
        Returns:
            bool: True if email sent successfully
        """
        if not self.enabled:
            logger.warning(f"Email service disabled. Would send: {subject} to {to_email}")
            return False
        
        try:
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.from_name} <{self.from_email}>"
            message["To"] = to_email
            
            # Add text content
            if text_content:
                text_part = MIMEText(text_content, "plain")
                message.attach(text_part)
            
            # Add HTML content
            html_part = MIMEText(html_content, "html")
            message.attach(html_part)
            
            # Add attachments if provided
            if attachments:
                for attachment in attachments:
                    self._add_attachment(message, attachment)
            
            # Send email
            with self._create_smtp_connection() as server:
                server.send_message(message)
            
            logger.info(f"Email sent successfully to {to_email}: {subject}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {e}")
            return False
    
    def _add_attachment(self, message: MIMEMultipart, attachment: Dict[str, Any]) -> None:
        """Add attachment to email message"""
        try:
            filename = attachment.get("filename")
            content = attachment.get("content")
            content_type = attachment.get("content_type", "application/octet-stream")
            
            part = MIMEBase(*content_type.split("/"))
            part.set_payload(content)
            encoders.encode_base64(part)
            part.add_header(
                "Content-Disposition",
                f"attachment; filename= {filename}"
            )
            message.attach(part)
            
        except Exception as e:
            logger.error(f"Failed to add attachment {attachment.get('filename')}: {e}")
    
    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        text_content: Optional[str] = None,
        attachments: Optional[List[Dict[str, Any]]] = None
    ) -> bool:
        """
        Send email asynchronously
        
        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML email content
            text_content: Plain text content (optional)
            attachments: List of attachments (optional)
            
        Returns:
            bool: True if email sent successfully
        """
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            self._send_email_sync,
            to_email,
            subject,
            html_content,
            text_content,
            attachments
        )
    
    async def send_verification_email(
        self,
        to_email: str,
        user_name: str,
        verification_token: str
    ) -> bool:
        """
        Send email verification email
        
        Args:
            to_email: User's email address
            user_name: User's full name
            verification_token: Email verification token
            
        Returns:
            bool: True if email sent successfully
        """
        verification_url = f"{settings.FRONTEND_URL}/verify-email?token={verification_token}"
        
        subject = "Welcome to GlucoVision - Verify Your Email"
        html_content = self._get_verification_email_template(
            user_name, verification_url
        )
        text_content = f"""
Welcome to GlucoVision, {user_name}!

Please verify your email address by clicking the link below:
{verification_url}

This link will expire in {settings.EMAIL_VERIFICATION_EXPIRE_HOURS} hours.

If you didn't create this account, please ignore this email.

Best regards,
The GlucoVision Team
        """
        
        return await self.send_email(
            to_email=to_email,
            subject=subject,
            html_content=html_content,
            text_content=text_content
        )
    
    async def send_password_reset_email(
        self,
        to_email: str,
        user_name: str,
        verification_code: str
    ) -> bool:
        """
        Send password reset email with verification code

        Args:
            to_email: User's email address
            user_name: User's full name
            verification_code: 6-digit verification code

        Returns:
            bool: True if email sent successfully
        """
        subject = "GlucoVision - Password Reset Verification Code"
        html_content = self._get_password_reset_email_template(
            user_name, verification_code
        )
        text_content = f"""
Hello {user_name},

You requested a password reset for your GlucoVision account.

Your verification code is: {verification_code}

This code will expire in 15 minutes.

If you didn't request this password reset, please ignore this email.

Best regards,
The GlucoVision Team
        """

        return await self.send_email(
            to_email=to_email,
            subject=subject,
            html_content=html_content,
            text_content=text_content
        )

    async def send_welcome_email(
        self,
        to_email: str,
        user_name: str
    ) -> bool:
        """
        Send welcome email after successful verification

        Args:
            to_email: User's email address
            user_name: User's full name

        Returns:
            bool: True if email sent successfully
        """
        subject = "Welcome to GlucoVision - Your Diabetes Management Journey Begins!"
        html_content = self._get_welcome_email_template(user_name)
        text_content = f"""
Welcome to GlucoVision, {user_name}!

Your email has been successfully verified and your account is now active.

You can now:
- Log your blood glucose readings
- Track your diabetes management progress
- Get AI-powered insights and recommendations
- Chat with our diabetes-focused AI assistant
- Generate professional reports for your healthcare provider

Start your journey to better diabetes management today!

Best regards,
The GlucoVision Team
        """

        return await self.send_email(
            to_email=to_email,
            subject=subject,
            html_content=html_content,
            text_content=text_content
        )
    
    def _get_verification_email_template(self, user_name: str, verification_url: str) -> str:
        """Get HTML template for email verification"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to GlucoVision</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to GlucoVision</h1>
                <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your diabetes management companion</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #333; margin-top: 0;">Hello {user_name}!</h2>
                
                <p>Thank you for joining GlucoVision. To complete your registration and start managing your diabetes with confidence, please verify your email address.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{verification_url}" style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Verify Email Address</a>
                </div>
                
                <p style="color: #666; font-size: 14px;">This link will expire in {settings.EMAIL_VERIFICATION_EXPIRE_HOURS} hours. If you didn't create this account, please ignore this email.</p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="color: #666; font-size: 12px; text-align: center;">
                    © 2024 GlucoVision. All rights reserved.<br>
                    This email was sent to {user_name} regarding their GlucoVision account.
                </p>
            </div>
        </body>
        </html>
        """
    
    def _get_password_reset_email_template(self, user_name: str, verification_code: str) -> str:
        """Get HTML template for password reset"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset - GlucoVision</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
                <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">GlucoVision Account Security</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #333; margin-top: 0;">Hello {user_name}!</h2>
                
                <p>You requested a password reset for your GlucoVision account. Use the verification code below to proceed:</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <div style="background: #667eea; color: white; padding: 20px; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 5px; display: inline-block;">
                        {verification_code}
                    </div>
                </div>
                
                <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes. If you didn't request this password reset, please ignore this email.</p>
                
                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                
                <p style="color: #666; font-size: 12px; text-align: center;">
                    © 2024 GlucoVision. All rights reserved.<br>
                    This email was sent to {user_name} regarding their GlucoVision account security.
                </p>
            </div>
        </body>
        </html>
        """

    def _get_welcome_email_template(self, user_name: str) -> str:
        """Get HTML template for welcome email"""
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to GlucoVision</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to GlucoVision!</h1>
                <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Your diabetes management journey begins now</p>
            </div>

            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
                <h2 style="color: #333; margin-top: 0;">Hello {user_name}!</h2>

                <p>Congratulations! Your email has been successfully verified and your GlucoVision account is now active.</p>

                <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #667eea;">
                    <h3 style="color: #667eea; margin-top: 0;">What you can do now:</h3>
                    <ul style="color: #555; padding-left: 20px;">
                        <li>📊 Log your blood glucose readings</li>
                        <li>📈 Track your diabetes management progress</li>
                        <li>🤖 Get AI-powered insights and recommendations</li>
                        <li>💬 Chat with our diabetes-focused AI assistant</li>
                        <li>📄 Generate professional reports for your healthcare provider</li>
                    </ul>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <p style="color: #667eea; font-weight: bold; font-size: 18px;">Ready to take control of your diabetes?</p>
                    <p style="color: #666;">Start logging your glucose readings and discover personalized insights!</p>
                </div>

                <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

                <p style="color: #666; font-size: 12px; text-align: center;">
                    © 2024 GlucoVision. All rights reserved.<br>
                    This email was sent to {user_name} to welcome them to GlucoVision.
                </p>
            </div>
        </body>
        </html>
        """


# Global email service instance
email_service = EmailService()
