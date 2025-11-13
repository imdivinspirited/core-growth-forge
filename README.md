# OvaBoe App - Custom Authentication System

A comprehensive authentication system built with custom mobile number verification, OAuth integration, 2FA, rate limiting, and session management.

## 🚀 Features

### 🔐 Authentication Methods

1. **Mobile Number Authentication**
   - Sign up with mobile number and password
   - Real-time OTP verification via SMS (Twilio)
   - Secure password hashing (SHA-256)
   - Multi-country support with country codes
   - **Rate limiting**: Max 5 OTP requests/hour, 1/minute per mobile

2. **OAuth Integration**
   - Google Sign-In
   - GitHub Sign-In
   - Facebook Sign-In

3. **Password Management**
   - Forgot password flow with OTP
   - Secure password reset
   - Session invalidation on password change
   - Email notifications for password changes

4. **Two-Factor Authentication (2FA)**
   - TOTP-based (Google Authenticator, Authy, etc.)
   - QR code setup
   - Recovery codes (10 per activation)
   - Sign-in challenge for 2FA users
   - Email notification on 2FA enable

### 📱 Real-Time SMS OTP Delivery

- Live SMS delivery via **Twilio**
- 6-digit OTP codes
- 10-minute expiration
- Automatic cleanup of expired OTPs
- Rate limiting to prevent abuse

### 🔔 Security Email Notifications

Powered by **Resend API**:
- New device sign-in alerts
- Password change confirmations
- 2FA activation notifications

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
   - No plain text credentials

2. **Rate Limiting**
   - OTP requests: 5/hour, 1/minute per mobile
   - Prevents brute force attacks
   - Applies to signup, signin, password reset

3. **Session Management**
   - JWT-like session tokens
   - Refresh tokens
   - 7-day session expiration
   - IP address and user agent tracking
   - Automatic session cleanup
   - New device detection

4. **Two-Factor Authentication**
   - TOTP verification (RFC 6238)
   - Recovery codes (hashed storage)
   - Last verified timestamp tracking
   - Secure 2FA disable flow

5. **Row-Level Security (RLS)**
   - User data isolation
   - Role-based access control
   - Admin privileges for management
   - Locked-down 2FA tables

### 🔧 Admin Auth Center

Accessible at `/admin/auth-center`:
- View all active user sessions
- Revoke sessions
- Manage user roles (user, moderator, admin)
- View audit logs
- Monitor authentication events

### 🗄️ Database Schema

#### Tables

1. **custom_users** - User accounts
2. **otp_codes** - OTP storage and validation
3. **user_sessions** - Active session tracking
4. **user_roles** - Role assignment
5. **profiles** - OAuth user profiles
6. **two_factor_settings** - 2FA configuration
7. **two_factor_recovery_codes** - Recovery code hashes
8. **audit_logs** - Security event tracking

## 🛠️ Setup

### Prerequisites

- Supabase project
- Twilio account (for SMS)
- Resend account (for email)
- OAuth credentials (Google, GitHub, Facebook)

### 1. Twilio Setup (SMS OTP)

1. Sign up at [twilio.com](https://www.twilio.com/)
2. Get a phone number
3. Navigate to Console → Account Info
4. Copy your credentials
5. Add secrets in Supabase Dashboard:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### 2. Resend Setup (Email Notifications)

1. Sign up at [resend.com](https://resend.com/)
2. Verify your domain at [resend.com/domains](https://resend.com/domains)
3. Create API key at [resend.com/api-keys](https://resend.com/api-keys)
4. Add secret in Supabase:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxx
   ```

### 3. OAuth Configuration

#### Google
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Configure OAuth consent screen
4. Add authorized domains: `<PROJECT_ID>.supabase.co`
5. Add callback URL from Supabase Dashboard
6. Configure in Supabase: Settings → Auth → Providers → Google

#### GitHub
1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create new OAuth app
3. Set callback URL from Supabase Dashboard
4. Configure in Supabase: Settings → Auth → Providers → GitHub

#### Facebook
1. Create app at [Facebook Developers](https://developers.facebook.com/)
2. Add Facebook Login product
3. Set OAuth redirect URI from Supabase Dashboard
4. Configure in Supabase: Settings → Auth → Providers → Facebook

### 4. Database Setup

The database migrations automatically create:
- All required tables
- RLS policies
- Database functions
- Triggers for maintenance
- 2FA infrastructure

## 📡 API Endpoints (Edge Functions)

### Authentication
- `POST /auth-signup` - Create new user account
- `POST /auth-signin` - Sign in with credentials
- `POST /auth-verify-otp` - Verify OTP code
- `POST /auth-session` - Validate session token
- `POST /auth-signout` - End user session
- `POST /auth-forgot-password` - Request password reset
- `POST /auth-reset-password` - Reset password with OTP

### Two-Factor Authentication
- `POST /twofactor-generate` - Generate 2FA secret & QR
- `POST /twofactor-verify` - Verify TOTP & enable 2FA
- `POST /twofactor-signin` - Verify 2FA during sign-in
- `POST /twofactor-disable` - Disable 2FA

### Security
- `POST /send-security-alert` - Send email notifications

## 📖 Usage

### Sign Up Flow

```typescript
// 1. User provides mobile number and password
const { error, requiresOtp } = await signUp(
  mobileNumber,
  countryCode,
  password,
  fullName
);

// 2. User receives OTP via SMS (no OTP in response for security)
// 3. User enters OTP to verify
const { error } = await verifyOtp(
  mobileNumber,
  countryCode,
  otpCode,
  'signup'
);
```

### Sign In Flow (with 2FA)

```typescript
// 1. User provides credentials
const { error, requiresOtp } = await signIn(
  mobileNumber,
  countryCode,
  password
);

// 2. User receives OTP via SMS
// 3. User enters OTP
const { error, requires2FA, sessionToken } = await verifyOtp(
  mobileNumber,
  countryCode,
  otpCode,
  'signin'
);

// 4. If 2FA enabled, verify TOTP
if (requires2FA) {
  const { user, session } = await verify2FASignin(
    sessionToken,
    totpCode,
    false // or true for recovery code
  );
}
```

### Enable 2FA

```typescript
// 1. Generate secret and QR code
const { otpauth } = await generate2FA(sessionToken);
// Display QR code to user

// 2. User scans QR and enters code
const { recoveryCodes } = await verify2FA(sessionToken, totpCode);
// Save recovery codes securely
```

### Password Reset Flow

```typescript
// 1. Request password reset
const { error } = await forgotPassword(mobileNumber, countryCode);

// 2. User receives OTP via SMS
// 3. Reset password with OTP
const { error } = await resetPassword(
  mobileNumber,
  countryCode,
  otpCode,
  newPassword
);
// User receives email confirmation
```

## 🔒 Security Audit Results

### ✅ Implemented Security Measures

1. **Authentication**
   - Secure password hashing (SHA-256)
   - OTP verification for sensitive operations
   - Session token validation
   - OAuth integration
   - 2FA with TOTP

2. **Authorization**
   - Role-based access control
   - RLS policies on all tables
   - Security definer functions for role checks
   - Admin-only endpoints

3. **Data Protection**
   - User data isolation
   - Encrypted session tokens
   - Secure password storage
   - No plain text credentials
   - 2FA secret encryption
   - Hashed recovery codes

4. **Rate Limiting**
   - OTP generation: 5/hour, 1/minute
   - Prevents brute force attacks
   - Per-mobile-number throttling

5. **Email Notifications**
   - New device sign-in alerts
   - Password change confirmations
   - 2FA activation notices

6. **Session Management**
   - Automatic expiration
   - Token refresh mechanism
   - Session invalidation on password change
   - Device tracking
   - New device detection

7. **Input Validation**
   - Mobile number format validation
   - Password strength requirements
   - OTP format validation

### ⚠️ Production Recommendations

1. **HTTPS Only**
   - Ensure all connections use HTTPS
   - Set secure cookie flags

2. **Monitoring**
   - Set up alerts for failed auth attempts
   - Monitor OTP usage patterns
   - Track session anomalies
   - Review audit logs regularly

3. **SMS Configuration**
   - Monitor SMS delivery rates
   - Set up SMS templates
   - Configure fallback options

4. **Email Configuration**
   - Verify sender domain
   - Monitor bounce rates
   - Set up SPF/DKIM/DMARC

5. **2FA Best Practices**
   - Encourage all users to enable 2FA
   - Provide clear recovery code instructions
   - Implement account recovery process

## 🧪 Testing

### Development Mode

- OTPs are logged in edge function console
- Use `/admin/auth-center` to monitor sessions
- Test 2FA with authenticator apps

### Test Accounts

Create test accounts in development:
- Use valid mobile number format (10-15 digits)
- Password minimum 8 characters
- OTP verification required
- Test 2FA flow with Google Authenticator

## 🔧 Maintenance

### Automatic Cleanup

Database functions run periodically:
- `clean_expired_otps()` - Removes expired OTPs
- `clean_expired_sessions()` - Removes expired sessions

### Manual Operations

Admin functions for:
- User management
- Role assignment
- Session monitoring
- Audit log review
- 2FA management

## 🏗️ Architecture

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
       ├── 2FA ──────────────┤
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
│  - twofactor-generate        │
│  - twofactor-verify          │
│  - twofactor-signin          │
│  - twofactor-disable         │
│  - send-security-alert       │
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
│  - two_factor_settings       │
│  - two_factor_recovery_codes │
│  - audit_logs                │
└──────────┬───────────────────┘
           │
           └──── RLS Policies

External Services:
├── Twilio (SMS OTP)
└── Resend (Email Notifications)
```

## 💻 Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Supabase Edge Functions (Deno)
- **Database**: PostgreSQL (Supabase)
- **SMS**: Twilio
- **Email**: Resend
- **Auth**: Custom + Supabase Auth (OAuth)
- **2FA**: otplib (TOTP RFC 6238)

## 📄 License

MIT

## 🆘 Support

For issues or questions, please contact support.

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Twilio API Reference](https://www.twilio.com/docs/usage/api)
- [Resend Documentation](https://resend.com/docs)
- [RFC 6238 (TOTP)](https://datatracker.ietf.org/doc/html/rfc6238)
