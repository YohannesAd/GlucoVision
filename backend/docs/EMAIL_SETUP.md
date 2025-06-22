# 📧 GlucoVision Email Setup Guide

## Overview

GlucoVision includes a professional email service for user communications including:
- **Email Verification**: Welcome emails and account verification
- **Password Reset**: Secure verification codes via email
- **Welcome Messages**: Professional onboarding emails

## 🚀 Quick Setup

### 1. Enable Email Service

Set the following in your `.env` file:

```bash
ENABLE_EMAIL=true
```

### 2. Configure SMTP Settings

Choose one of the email providers below and update your `.env` file:

## 📮 Email Provider Configurations

### Gmail (Recommended for Development)

```bash
ENABLE_EMAIL=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_TLS=true
SMTP_SSL=false
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=GlucoVision
```

**Setup Steps:**
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use the App Password (not your regular password) in `SMTP_PASSWORD`

### Outlook/Hotmail

```bash
ENABLE_EMAIL=true
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USERNAME=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_TLS=true
SMTP_SSL=false
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=GlucoVision
```

### SendGrid (Production Recommended)

```bash
ENABLE_EMAIL=true
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-sendgrid-api-key
SMTP_TLS=true
SMTP_SSL=false
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=GlucoVision
```

### Mailgun

```bash
ENABLE_EMAIL=true
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USERNAME=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your-mailgun-password
SMTP_TLS=true
SMTP_SSL=false
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=GlucoVision
```

## 🔧 Configuration Options

### Required Settings

| Setting | Description | Example |
|---------|-------------|---------|
| `ENABLE_EMAIL` | Enable/disable email service | `true` |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_USERNAME` | SMTP username/email | `your-email@gmail.com` |
| `SMTP_PASSWORD` | SMTP password/API key | `your-app-password` |

### Optional Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `SMTP_TLS` | Use TLS encryption | `true` |
| `SMTP_SSL` | Use SSL encryption | `false` |
| `FROM_EMAIL` | Sender email address | `noreply@glucovision.app` |
| `FROM_NAME` | Sender display name | `GlucoVision` |
| `EMAIL_VERIFICATION_EXPIRE_HOURS` | Verification token expiry | `24` |
| `FRONTEND_URL` | Frontend URL for links | `http://localhost:19006` |

## 📧 Email Types

### 1. Email Verification
- **Trigger**: User registration
- **Purpose**: Verify email address and activate account
- **Contains**: Verification link with token
- **Expiry**: 24 hours (configurable)

### 2. Password Reset
- **Trigger**: Forgot password request
- **Purpose**: Secure password reset process
- **Contains**: 6-digit verification code
- **Expiry**: 15 minutes

### 3. Welcome Email
- **Trigger**: Successful email verification
- **Purpose**: Welcome user and explain features
- **Contains**: Feature overview and getting started tips

## 🧪 Testing Email Functionality

### 1. Test Email Configuration

```bash
# Start the backend server
python run.py

# Check logs for email service status
# Should see: "Email service initialized successfully"
```

### 2. Test Registration Flow

1. Register a new user via API or frontend
2. Check email inbox for verification email
3. Click verification link or use verification endpoint
4. Should receive welcome email

### 3. Test Password Reset

1. Use forgot password endpoint with registered email
2. Check email for verification code
3. Use code to reset password

## 🚨 Troubleshooting

### Email Not Sending

1. **Check Configuration**
   ```bash
   # Verify all required settings are set
   echo $ENABLE_EMAIL
   echo $SMTP_HOST
   echo $SMTP_USERNAME
   ```

2. **Check Logs**
   ```bash
   # Look for email service errors in backend logs
   tail -f backend.log | grep -i email
   ```

3. **Test SMTP Connection**
   - Verify SMTP credentials work with email client
   - Check firewall/network restrictions
   - Ensure 2FA and app passwords are configured

### Common Issues

| Issue | Solution |
|-------|----------|
| "Authentication failed" | Check username/password, enable app passwords |
| "Connection refused" | Verify SMTP host and port |
| "TLS/SSL errors" | Check TLS/SSL settings match provider requirements |
| "Rate limiting" | Use production email service (SendGrid, Mailgun) |

### Fallback Behavior

When email is disabled or fails:
- Registration still works (user created but unverified)
- Password reset codes are logged to console
- Application continues to function normally

## 🔒 Security Best Practices

1. **Use App Passwords**: Never use regular passwords for SMTP
2. **Environment Variables**: Store credentials in `.env` file, not code
3. **Production Services**: Use professional email services for production
4. **Rate Limiting**: Implement rate limiting for email endpoints
5. **Validation**: Always validate email addresses before sending

## 📊 Monitoring

### Email Metrics to Track

- Email delivery success rate
- Verification completion rate
- Password reset completion rate
- Bounce/failure rates

### Logging

The email service logs:
- Successful email sends
- Failed email attempts
- Configuration issues
- SMTP connection problems

## 🚀 Production Deployment

### Recommended Setup

1. **Use Professional Email Service**
   - SendGrid (recommended)
   - Mailgun
   - Amazon SES

2. **Configure Domain**
   - Set up SPF records
   - Configure DKIM
   - Set up DMARC policy

3. **Monitor Performance**
   - Set up email delivery monitoring
   - Track bounce rates
   - Monitor spam complaints

### Environment Variables for Production

```bash
ENABLE_EMAIL=true
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=your-production-api-key
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=GlucoVision
FRONTEND_URL=https://your-production-domain.com
```

## 📞 Support

For email setup issues:
1. Check this documentation
2. Review backend logs
3. Test SMTP settings manually
4. Consult email provider documentation

---

**Note**: Email functionality is optional. The application will work without email configuration, but users won't receive verification emails or password reset codes via email.
