# AuraUp API Documentation

## Overview

AuraUp uses Supabase Edge Functions as the backend API layer. All endpoints are RESTful and return JSON responses.

**Base URL**: `https://giasxieqdyyqvsmtibfr.supabase.co/functions/v1`

---

## Authentication

### Headers

All authenticated endpoints require the following header:

```
Authorization: Bearer <session_token>
```

The session token is obtained after successful OTP verification during sign-in.

---

## Endpoints

### 1. User Registration

#### `POST /auth-signup`

Creates a new user account and sends OTP for verification.

**Request Body:**
```json
{
  "mobileNumber": "9876543210",
  "countryCode": "+91",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

**Success Response (201):**
```json
{
  "message": "User created successfully. OTP sent to your mobile.",
  "mobileNumber": "9876543210",
  "countryCode": "+91",
  "requiresOtp": true,
  "smsSent": true
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| 400 | `Mobile number and password are required` | Missing required fields |
| 400 | `Invalid mobile number format` | Mobile number validation failed |
| 400 | `Password must be at least 8 characters` | Password too short |
| 400 | `User with this mobile number already exists` | Duplicate registration |
| 429 | `Too many OTP requests` | Rate limit exceeded |

---

### 2. User Sign-In

#### `POST /auth-signin`

Authenticates user and sends OTP for verification.

**Request Body:**
```json
{
  "mobileNumber": "9876543210",
  "countryCode": "+91",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "message": "OTP sent to your mobile number",
  "mobileNumber": "9876543210",
  "countryCode": "+91",
  "requiresOtp": true,
  "smsSent": true
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| 400 | `Mobile number and password are required` | Missing credentials |
| 401 | `Invalid mobile number or password` | Authentication failed |
| 403 | `Account is deactivated` | Account suspended |
| 403 | `Mobile number not verified` | Pending verification |
| 429 | `Too many OTP requests` | Rate limit exceeded |

---

### 3. OTP Verification

#### `POST /auth-verify-otp`

Verifies OTP and creates session.

**Request Body:**
```json
{
  "mobileNumber": "9876543210",
  "countryCode": "+91",
  "otpCode": "123456",
  "otpType": "signin"
}
```

**otpType values:** `signup`, `signin`, `password_reset`

**Success Response (200):**
```json
{
  "message": "OTP verified successfully",
  "sessionToken": "jwt_token_here",
  "user": {
    "id": "uuid",
    "mobileNumber": "9876543210",
    "fullName": "John Doe",
    "isVerified": true
  }
}
```

**Error Responses:**

| Status | Error | Description |
|--------|-------|-------------|
| 400 | `All fields are required` | Missing fields |
| 400 | `Invalid OTP` | OTP mismatch |
| 400 | `OTP has expired` | OTP timeout |
| 429 | `Too many failed attempts` | Security lockout |

---

### 4. Password Reset Request

#### `POST /auth-forgot-password`

Initiates password reset flow.

**Request Body:**
```json
{
  "mobileNumber": "9876543210",
  "countryCode": "+91"
}
```

**Success Response (200):**
```json
{
  "message": "OTP sent to your mobile number",
  "requiresOtp": true,
  "smsSent": true
}
```

---

### 5. Password Reset

#### `POST /auth-reset-password`

Resets password after OTP verification.

**Request Body:**
```json
{
  "mobileNumber": "9876543210",
  "countryCode": "+91",
  "otpCode": "123456",
  "newPassword": "NewSecurePass123!"
}
```

**Success Response (200):**
```json
{
  "message": "Password reset successfully"
}
```

---

### 6. Sign Out

#### `POST /auth-signout`

Invalidates current session.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Success Response (200):**
```json
{
  "message": "Signed out successfully"
}
```

---

### 7. Session Validation

#### `GET /auth-session`

Validates current session and returns user info.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Success Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": "uuid",
    "mobileNumber": "9876543210",
    "fullName": "John Doe"
  }
}
```

---

### 8. Get User Profile

#### `GET /api-me`

Returns current user's profile and preferences.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "John Doe",
      "mobileNumber": "9876543210",
      "countryCode": "+91",
      "isVerified": true,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLoginAt": "2024-01-15T10:30:00Z"
    },
    "preferences": {
      "theme_preference": "dark",
      "language_preference": "en",
      "privacy_profile": "public"
    },
    "roles": ["user", "student"],
    "stats": {
      "coursesInProgress": 3,
      "coursesCompleted": 5,
      "badgesEarned": 12,
      "blogPosts": 7
    }
  }
}
```

---

### 9. Update User Profile

#### `PATCH /api-me`

Updates user profile and/or preferences.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Request Body:**
```json
{
  "fullName": "John Smith",
  "preferences": {
    "theme_preference": "light",
    "language_preference": "es"
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "message": "Profile updated successfully"
  }
}
```

---

### 10. Get Dashboard Data

#### `GET /api-dashboard`

Returns aggregated dashboard data.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "fullName": "John Doe",
      "email": "user@example.com"
    },
    "stats": {
      "totalCourses": 8,
      "completedCourses": 5,
      "completionRate": 62.5,
      "totalBadges": 12,
      "totalBlogs": 7,
      "totalBookmarks": 15,
      "currentStreak": 7,
      "longestStreak": 21
    },
    "achievements": [
      {
        "id": "uuid",
        "badge_name": "First Blog",
        "badge_description": "Published your first blog post",
        "badge_icon": "📝",
        "category": "writing",
        "earned_at": "2024-01-10T00:00:00Z"
      }
    ],
    "learningProgress": [
      {
        "course_id": "uuid",
        "title": "React Fundamentals",
        "progress": 75,
        "last_accessed": "2024-01-15T00:00:00Z"
      }
    ],
    "activity": [
      {
        "type": "course_progress",
        "title": "Completed lesson in React Fundamentals",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ],
    "recommendations": [],
    "generatedAt": "2024-01-15T12:00:00Z"
  }
}
```

---

## Two-Factor Authentication

### 11. Generate 2FA Secret

#### `POST /twofactor-generate`

Generates TOTP secret and QR code for 2FA setup.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "secret": "BASE32_SECRET",
  "qrCode": "data:image/png;base64,...",
  "backupCodes": [
    "XXXX-XXXX-XXXX",
    "YYYY-YYYY-YYYY"
  ]
}
```

---

### 12. Verify 2FA Setup

#### `POST /twofactor-verify`

Verifies TOTP code and enables 2FA.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Request Body:**
```json
{
  "code": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Two-factor authentication enabled"
}
```

---

### 13. 2FA Sign-In

#### `POST /twofactor-signin`

Verifies 2FA code during sign-in.

**Request Body:**
```json
{
  "userId": "uuid",
  "code": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "sessionToken": "jwt_token_here"
}
```

---

### 14. Disable 2FA

#### `POST /twofactor-disable`

Disables two-factor authentication.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Request Body:**
```json
{
  "code": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Two-factor authentication disabled"
}
```

---

## Notifications

### 15. Send Notification

#### `POST /send-notification`

Sends a notification to a user.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Request Body:**
```json
{
  "userId": "uuid",
  "title": "New Achievement!",
  "message": "You earned the First Blog badge",
  "type": "achievement",
  "channel": "in_app"
}
```

**channel values:** `in_app`, `email`, `sms`, `push`

---

## AI Features

### 16. Get Recommendations

#### `GET /ai-recommendations`

Returns AI-powered personalized recommendations.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "uuid",
        "title": "Advanced TypeScript",
        "confidence": 0.92,
        "reason": "Based on your JavaScript progress"
      }
    ],
    "blogs": [...],
    "workshops": [...]
  }
}
```

---

## Error Codes Reference

| HTTP Status | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Access denied |
| 404 | Not Found |
| 429 | Too Many Requests - Rate limited |
| 500 | Internal Server Error |

---

## Rate Limits

| Endpoint Type | Limit |
|---------------|-------|
| OTP Requests | 5 per hour per mobile |
| OTP Retry | 60 seconds cooldown |
| Failed OTP Attempts | 5 per OTP |
| API Requests | 100 per minute |

---

## Security Considerations

1. **Token Storage**: Store session tokens securely (localStorage for web, Keychain/Keystore for mobile)
2. **HTTPS Only**: All requests must use HTTPS
3. **Token Expiry**: Sessions expire after 7 days
4. **2FA**: Enable 2FA for enhanced security
5. **Rate Limiting**: Respect rate limits to avoid lockouts

---

## SDK Usage

### JavaScript/TypeScript

```typescript
import { supabase } from '@/integrations/supabase/client';

// Call edge function
const { data, error } = await supabase.functions.invoke('api-me', {
  headers: {
    Authorization: `Bearer ${sessionToken}`
  }
});
```

### Using API Client

```typescript
import { api } from '@/lib/api';

// Get user profile
const response = await api.getMe();
if (response.success) {
  console.log(response.data);
}

// Update profile
await api.updateMe({
  fullName: 'New Name',
  preferences: { theme_preference: 'dark' }
});
```

---

## Changelog

### v1.0.0 (Current)
- Initial API release
- Mobile OTP authentication
- OAuth providers (Google, GitHub, Facebook)
- Two-factor authentication
- User profiles and preferences
- Dashboard aggregation
- AI recommendations
