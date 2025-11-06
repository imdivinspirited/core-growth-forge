# Custom Authentication System

A comprehensive authentication system built with custom mobile number verification, OAuth integration, and session management.

## Features

### 🔐 Authentication Methods

1. **Mobile Number Authentication**
   - Sign up with mobile number and password
   - OTP verification via SMS (Twilio integration)
   - Secure password hashing (SHA-256)
   - Country code support

2. **OAuth Integration**
   - Google Sign-In
   - GitHub Sign-In
   - Facebook Sign-In

3. **Password Management**
   - Forgot password flow
   - OTP-based password reset
   - Session invalidation on password change

### 📱 SMS OTP Delivery

- Real-time SMS delivery via Twilio
- Fallback to console logging when SMS not configured
- 6-digit OTP codes
- 10-minute expiration
- Automatic cleanup of expired OTPs

### 👤 User Profile Management

- View and edit personal information
- Mobile number verification status
- Account status tracking
- Session management

### 🛡️ Security Features

1. **Password Security**
   - Minimum 8 characters required
   - SHA-256 hashing
   - Secure storage

2. **Session Management**
   - JWT-like session tokens
   - Refresh tokens
   - 7-day session expiration
   - IP address and user agent tracking
   - Automatic session cleanup

3. **OTP Security**
   - One-time use verification
   - Expiration tracking
   - Type-specific OTPs (signup, signin, password_reset)

4. **Row-Level Security (RLS)**
   - User data isolation
   - Role-based access control
   - Admin privileges for management

### 🗄️ Database Schema

#### Tables

1. **custom_users**
   - User account information
   - Mobile number and country code
   - Password hash
   - Verification and active status
   - OAuth integration support

2. **otp_codes**
   - OTP storage and validation
   - Expiration tracking
   - Usage tracking

3. **user_sessions**
   - Active session tracking
   - Token management
   - Device information

4. **user_roles**
   - Role assignment (admin, moderator, user)
   - Enum-based role type

5. **profiles**
   - OAuth user profiles
   - Synced with auth.users

## Setup

### Prerequisites

- Supabase project
- Twilio account (for SMS)
- OAuth credentials (Google, GitHub, Facebook)

### Environment Variables

Configure the following secrets in Supabase:

```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### OAuth Configuration

1. **Google**
   - Configure OAuth consent screen
   - Add authorized domains
   - Set redirect URLs

2. **GitHub**
   - Create OAuth app
   - Add callback URL

3. **Facebook**
   - Create Facebook app
   - Configure OAuth settings

### Database Setup

The database migrations automatically create:
- All required tables
- RLS policies
- Database functions
- Triggers for maintenance

## API Endpoints (Edge Functions)

### Authentication

- `POST /auth-signup` - Create new user account
- `POST /auth-signin` - Sign in with credentials
- `POST /auth-verify-otp` - Verify OTP code
- `POST /auth-session` - Validate session token
- `POST /auth-signout` - End user session
- `POST /auth-forgot-password` - Request password reset
- `POST /auth-reset-password` - Reset password with OTP

## Usage

### Sign Up Flow

```typescript
// 1. User provides mobile number and password
const { error, requiresOtp, otp } = await signUp(
  mobileNumber,
  countryCode,
  password,
  fullName
);

// 2. User receives OTP via SMS
// 3. User enters OTP to verify
const { error } = await verifyOtp(
  mobileNumber,
  countryCode,
  otpCode,
  'signup'
);
```

### Sign In Flow

```typescript
// 1. User provides credentials
const { error, requiresOtp } = await signIn(
  mobileNumber,
  countryCode,
  password
);

// 2. User receives OTP via SMS
// 3. User enters OTP to complete signin
const { error } = await verifyOtp(
  mobileNumber,
  countryCode,
  otpCode,
  'signin'
);
```

### Password Reset Flow

```typescript
// 1. Request password reset
const { error, requiresOtp } = await forgotPassword(
  mobileNumber,
  countryCode
);

// 2. User receives OTP via SMS
// 3. Reset password with OTP
const { error } = await resetPassword(
  mobileNumber,
  countryCode,
  otpCode,
  newPassword
);
```

### OAuth Flow

```typescript
// Initiate OAuth flow
await signInWithOAuth('google' | 'github' | 'facebook');
```

### Profile Management

```typescript
// Update user profile
const { error } = await updateProfile({
  fullName: 'New Name'
});
```

## Security Audit Results

### ✅ Implemented Security Measures

1. **Authentication**
   - Secure password hashing (SHA-256)
   - OTP verification for sensitive operations
   - Session token validation
   - OAuth integration

2. **Authorization**
   - Role-based access control
   - RLS policies on all tables
   - Security definer functions for role checks

3. **Data Protection**
   - User data isolation
   - Encrypted session tokens
   - Secure password storage
   - No plain text credentials

4. **Session Management**
   - Automatic expiration
   - Token refresh mechanism
   - Session invalidation on password change
   - Device tracking

5. **Input Validation**
   - Mobile number format validation
   - Password strength requirements
   - OTP format validation

### ⚠️ Production Recommendations

1. **Remove OTP from responses**
   - Currently included for testing
   - Remove `otp` field in production

2. **Rate Limiting**
   - Implement rate limiting on OTP generation
   - Prevent brute force attacks

3. **HTTPS Only**
   - Ensure all connections use HTTPS
   - Set secure cookie flags

4. **Monitoring**
   - Set up alerts for failed auth attempts
   - Monitor OTP usage patterns
   - Track session anomalies

5. **SMS Configuration**
   - Configure Twilio credentials
   - Set up SMS templates
   - Monitor SMS delivery rates

## Testing

### Development Mode

OTPs are displayed in:
- Console logs (edge functions)
- UI notifications (for testing)
- API responses (remove in production)

### Test Accounts

Create test accounts in development:
- Use valid mobile number format
- Password minimum 8 characters
- OTP verification required

## Maintenance

### Automatic Cleanup

Database functions run periodically:
- `clean_expired_otps()` - Removes expired OTPs
- `clean_expired_sessions()` - Removes expired sessions

### Manual Operations

Admin functions for:
- User management
- Role assignment
- Session monitoring
- Fraud detection

## Architecture

```
┌─────────────┐
│   Frontend  │
│  (React)    │
└──────┬──────┘
       │
       ├── Custom Auth ──────┐
       │                     │
       ├── OAuth ────────────┤
       │                     │
       v                     v
┌──────────────────────────────┐
│   Supabase Edge Functions    │
├──────────────────────────────┤
│  - auth-signup               │
│  - auth-signin               │
│  - auth-verify-otp           │
│  - auth-forgot-password      │
│  - auth-reset-password       │
│  - auth-session              │
│  - auth-signout              │
└──────────┬───────────────────┘
           │
           v
┌──────────────────────────────┐
│   Supabase Database          │
├──────────────────────────────┤
│  - custom_users              │
│  - otp_codes                 │
│  - user_sessions             │
│  - user_roles                │
│  - profiles                  │
└──────────┬───────────────────┘
           │
           └──── RLS Policies
```

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Supabase Edge Functions (Deno)
- **Database**: PostgreSQL (Supabase)
- **SMS**: Twilio
- **Auth**: Custom + Supabase Auth (OAuth)

## License

MIT

## Support

For issues or questions, please contact support.
