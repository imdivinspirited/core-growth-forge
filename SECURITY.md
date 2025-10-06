# Security Policy

## Overview

This application implements comprehensive security measures including authentication, authorization, row-level security, and input validation. This document outlines our security architecture and best practices.

## Security Features

### 1. Authentication System

**Implementation**: Supabase Auth with email/password
- Secure password requirements (8+ chars, uppercase, lowercase, numbers)
- Email verification on signup
- Session management with automatic token refresh
- Secure cookie-based session storage

**Best Practices**:
- Never log sensitive auth data to console in production
- Always use HTTPS in production
- Implement proper error handling without exposing internals

### 2. Role-Based Access Control (RBAC)

**Architecture**:
```
- Roles stored in separate `user_roles` table
- Three-tier system: admin, moderator, user
- Security definer function `has_role()` prevents RLS recursion
- Automatic role assignment on user creation
```

**Role Permissions**:
- **User**: Create/edit own content, view public content
- **Moderator**: Moderate community posts, additional content management
- **Admin**: Full system access, user management, all content moderation

**Critical Security Rules**:
- ❌ NEVER store roles in localStorage/sessionStorage
- ❌ NEVER check admin status client-side only
- ✅ ALWAYS use `has_role()` function in RLS policies
- ✅ ALWAYS validate permissions server-side

### 3. Row-Level Security (RLS)

All tables have RLS enabled with appropriate policies:

**profiles**
- Users can view their own complete profile
- Public profiles viewable with limited fields only
- Email and phone numbers protected from public access

**blogs**
- Authenticated users can create blogs
- Authors can edit their own blogs
- Admins can moderate any blog
- Published blogs publicly readable

**user_roles**
- Users can view their own roles
- Only admins can manage roles

**audit_logs**
- Admin-only access
- Automatic logging of sensitive operations

### 4. Input Validation

**Schema Validation**: All user inputs validated using Zod schemas

```typescript
// Example validation
const profileSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email().max(255),
  // ... more validations
});
```

**Validation Points**:
- Client-side: Immediate feedback, UX improvement
- Server-side: RLS policies, database constraints
- Edge functions: Additional validation layer

**Protected Against**:
- SQL Injection (via parameterized queries)
- XSS (no dangerouslySetInnerHTML, proper escaping)
- CSRF (Supabase handles token validation)
- Input length attacks (max length validation)

### 5. Audit Logging

**Tracked Events**:
- User authentication attempts
- Role changes
- Content moderation actions
- Sensitive data access

**Log Structure**:
```sql
CREATE TABLE audit_logs (
    user_id UUID,
    action TEXT,
    table_name TEXT,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    created_at TIMESTAMP
);
```

## Security Vulnerabilities Fixed

### ✅ Critical: PII Exposure (RESOLVED)
**Issue**: Profiles table was publicly readable with email/phone
**Fix**: Implemented privacy-respecting RLS policies
**Status**: Fixed in migration `20251006083952`

### ✅ High: Missing Authentication (RESOLVED)
**Issue**: No login/signup system
**Fix**: Full authentication system with protected routes
**Status**: Implemented

### ✅ High: No RBAC (RESOLVED)
**Issue**: No user roles or permissions system
**Fix**: Three-tier RBAC with security definer functions
**Status**: Implemented

### ✅ Medium: Missing Input Validation (RESOLVED)
**Issue**: Forms lacked validation
**Fix**: Zod schemas for all inputs
**Status**: Implemented

## Remaining Security Considerations

### PostgreSQL Version (WARN)
**Issue**: Current version has available security patches
**Action Required**: User must upgrade in Supabase Dashboard
**Impact**: Low (mitigated by other security layers)
**How to Fix**: See [Supabase Upgrade Guide](https://supabase.com/docs/guides/platform/upgrading)

### Future Enhancements

1. **Two-Factor Authentication (2FA)**
   - TOTP-based 2FA
   - Backup codes
   - SMS verification option

2. **Rate Limiting**
   - Login attempt limits
   - API request throttling
   - Content creation rate limits

3. **Content Security Policy (CSP)**
   - Strict CSP headers
   - Nonce-based script execution
   - Prevent inline scripts

4. **Advanced Monitoring**
   - Real-time threat detection
   - Anomaly detection
   - Security event alerts

## Reporting Security Issues

If you discover a security vulnerability, please:

1. **DO NOT** open a public GitHub issue
2. Email security concerns to the project maintainer
3. Include detailed steps to reproduce
4. Allow reasonable time for patching before public disclosure

## Security Checklist for Developers

Before deploying new features:

- [ ] All user inputs validated with Zod schemas
- [ ] RLS policies tested for new tables
- [ ] No sensitive data logged to console
- [ ] Edge functions use proper authentication
- [ ] Role checks use `has_role()` function
- [ ] No SQL injection vulnerabilities
- [ ] XSS prevention verified
- [ ] HTTPS enforced in production
- [ ] Secrets properly stored in Supabase
- [ ] Audit logging for sensitive operations

## Authentication Configuration

### Required Supabase Settings

1. **URL Configuration** (Authentication > URL Configuration)
   - Site URL: `https://yourdomain.com`
   - Redirect URLs: Include all deployment URLs

2. **Email Templates** (Authentication > Email Templates)
   - Customize confirmation email
   - Customize password reset email
   - Add branding

3. **Password Requirements** (Enforced in validation)
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number

## Database Security

### Table Access Patterns

```sql
-- ✅ CORRECT: Using RLS policies
SELECT * FROM profiles WHERE user_id = auth.uid();

-- ❌ WRONG: Bypassing RLS
SELECT * FROM profiles; -- Would return all profiles
```

### Security Definer Functions

```sql
-- Safe role checking without RLS recursion
CREATE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

## API Security

### Edge Functions

All edge functions must:
- Validate authentication tokens
- Check user permissions
- Validate all inputs
- Return appropriate error codes
- Never expose internal errors to clients

### Rate Limiting (Recommended)

Implement in edge functions:
```typescript
// Example rate limit check
const MAX_REQUESTS = 100;
const WINDOW = 60000; // 1 minute

// Track requests per user
// Reject if exceeded
```

## Compliance

### Data Protection
- User data encrypted at rest (Supabase default)
- Secure transmission (HTTPS/TLS)
- Right to deletion (implement data export/deletion)
- Audit trail for data access

### GDPR Considerations
- Privacy controls in profiles
- Data export capability
- Account deletion workflow
- Cookie consent (if using analytics)

## Security Updates

This document will be updated as:
- New security features are added
- Vulnerabilities are discovered and fixed
- Best practices evolve
- Framework updates require changes

Last Updated: 2025-10-06
