# 📧 Frontend Email Integration Guide

## Overview

This guide explains how to integrate the email verification and password reset functionality into the GlucoVision frontend.

## 🔗 New API Endpoints

### Email Verification

```typescript
// Verify email address
POST /api/v1/auth/verify-email
{
  "token": "verification-token-from-email"
}

// Resend verification email
POST /api/v1/auth/resend-verification
{
  "email": "user@example.com"
}
```

### Updated Registration Flow

The registration endpoint now sends verification emails automatically:

```typescript
POST /api/v1/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "confirm_password": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe"
}

// Response includes message about email verification
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": { ... },
  "tokens": { ... }
}
```

## 📱 Frontend Implementation

### 1. Email Verification Screen

Create a new screen for email verification:

```typescript
// screens/auth/EmailVerificationScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useAPI } from '../../hooks/useAPI';

export const EmailVerificationScreen = ({ route, navigation }) => {
  const [verificationCode, setVerificationCode] = useState('');
  const { post, loading } = useAPI();

  const handleVerifyEmail = async () => {
    try {
      const response = await post('/auth/verify-email', {
        token: verificationCode
      });
      
      if (response.user_verified) {
        // Show success message and navigate to dashboard
        navigation.navigate('Dashboard');
      }
    } catch (error) {
      // Handle verification error
      console.error('Verification failed:', error);
    }
  };

  const handleResendEmail = async () => {
    try {
      await post('/auth/resend-verification', {
        email: route.params?.email
      });
      // Show success message
    } catch (error) {
      console.error('Resend failed:', error);
    }
  };

  return (
    <View>
      <Text>Check your email for verification link</Text>
      <TextInput
        placeholder="Enter verification code"
        value={verificationCode}
        onChangeText={setVerificationCode}
      />
      <TouchableOpacity onPress={handleVerifyEmail}>
        <Text>Verify Email</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleResendEmail}>
        <Text>Resend Email</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### 2. Update Registration Flow

Modify the registration screen to handle email verification:

```typescript
// In your registration screen
const handleRegister = async (userData) => {
  try {
    const response = await post('/auth/register', userData);
    
    // Show success message about email verification
    Alert.alert(
      'Registration Successful',
      'Please check your email to verify your account.',
      [
        {
          text: 'OK',
          onPress: () => navigation.navigate('EmailVerification', {
            email: userData.email
          })
        }
      ]
    );
  } catch (error) {
    // Handle registration error
  }
};
```

### 3. Deep Link Handling

Handle email verification links in your app:

```typescript
// App.tsx or navigation setup
import { Linking } from 'react-native';

const handleDeepLink = (url: string) => {
  if (url.includes('/verify-email')) {
    const token = url.split('token=')[1];
    if (token) {
      // Navigate to verification screen with token
      navigation.navigate('EmailVerification', { token });
    }
  }
};

// Set up deep link listener
useEffect(() => {
  const subscription = Linking.addEventListener('url', ({ url }) => {
    handleDeepLink(url);
  });

  return () => subscription?.remove();
}, []);
```

### 4. Update API Endpoints

Add the new endpoints to your API service:

```typescript
// services/api/endpoints.ts
export const authEndpoints = {
  // ... existing endpoints
  
  verifyEmail: (token: string) => 
    apiClient.post('/auth/verify-email', { token }),
    
  resendVerification: (email: string) => 
    apiClient.post('/auth/resend-verification', { email }),
};
```

## 🔄 User Flow

### Registration with Email Verification

1. **User registers** → Backend creates account (unverified)
2. **Email sent** → User receives verification email
3. **User clicks link** → App opens verification screen
4. **Email verified** → User receives welcome email
5. **Account activated** → User can access all features

### Password Reset with Email

1. **User requests reset** → Backend sends verification code
2. **Email received** → User gets 6-digit code
3. **Code entered** → User proceeds to reset password
4. **Password updated** → User can login with new password

## 🎨 UI Components

### Email Verification Banner

Show verification status in the app:

```typescript
const EmailVerificationBanner = ({ user }) => {
  if (user.is_verified) return null;

  return (
    <View style={styles.banner}>
      <Text>Please verify your email address</Text>
      <TouchableOpacity onPress={handleResendEmail}>
        <Text>Resend Email</Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Loading States

Handle loading states for email operations:

```typescript
const [emailLoading, setEmailLoading] = useState(false);

const handleEmailAction = async () => {
  setEmailLoading(true);
  try {
    // Email operation
  } finally {
    setEmailLoading(false);
  }
};
```

## 🧪 Testing

### Test Email Verification

1. Register a new user
2. Check email inbox for verification email
3. Click verification link or enter code
4. Verify account is activated

### Test Password Reset

1. Use forgot password feature
2. Check email for verification code
3. Enter code and reset password
4. Login with new password

## 🔧 Configuration

### Environment Variables

Update your frontend configuration:

```typescript
// config/api.ts
export const API_CONFIG = {
  BASE_URL: 'http://your-backend-url:8000',
  // Add any email-related frontend config
};
```

### Deep Link Configuration

Configure deep links in your app.json:

```json
{
  "expo": {
    "scheme": "glucovision",
    "web": {
      "bundler": "metro"
    }
  }
}
```

## 📱 Navigation Updates

Add email verification to your navigation:

```typescript
// navigation/AuthNavigator.tsx
const AuthStack = createStackNavigator();

export const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
    <AuthStack.Screen 
      name="EmailVerification" 
      component={EmailVerificationScreen} 
    />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);
```

## 🎯 Best Practices

1. **User Feedback**: Always show loading states and success/error messages
2. **Graceful Degradation**: App should work even if email is disabled
3. **Security**: Never expose sensitive tokens in logs
4. **UX**: Make email verification optional for basic app usage
5. **Testing**: Test with real email providers before production

## 🚀 Production Considerations

1. **Email Provider**: Use professional email service (SendGrid, Mailgun)
2. **Domain Setup**: Configure SPF, DKIM, and DMARC records
3. **Monitoring**: Track email delivery rates and failures
4. **Rate Limiting**: Implement rate limiting for email endpoints
5. **Fallback**: Have fallback methods if email fails

---

This integration provides a complete email verification system that enhances security while maintaining a smooth user experience.
