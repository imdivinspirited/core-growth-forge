# AuraUp Architecture Documentation

## Overview

AuraUp is a professional personal branding and development platform built with modern web technologies. This document outlines the system architecture, design patterns, and key implementation details.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                            │
├─────────────────────────────────────────────────────────────────────┤
│  React + TypeScript + Vite                                          │
│  ├── Components (UI Layer)                                          │
│  ├── Hooks (State & Logic)                                          │
│  ├── Context (Global State)                                         │
│  └── Pages (Route Components)                                       │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       EDGE FUNCTIONS (Backend)                       │
├─────────────────────────────────────────────────────────────────────┤
│  Supabase Edge Functions (Deno Runtime)                             │
│  ├── auth-* (Authentication endpoints)                              │
│  ├── api-me (User profile API)                                      │
│  ├── api-dashboard (Dashboard data API)                             │
│  └── twofactor-* (2FA endpoints)                                    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         SUPABASE (Backend)                          │
├─────────────────────────────────────────────────────────────────────┤
│  ├── PostgreSQL Database                                            │
│  ├── Authentication (OAuth + Custom)                                │
│  ├── Row Level Security (RLS)                                       │
│  └── Real-time Subscriptions                                        │
└─────────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
auraup/
├── src/
│   ├── components/           # React components
│   │   ├── animations/       # Animation components (GSAP, Framer Motion)
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Dashboard UI components
│   │   ├── home/             # Homepage sections
│   │   ├── layout/           # Layout components (Navigation, etc.)
│   │   ├── logo/             # Brand logo components
│   │   ├── profile/          # User profile components
│   │   ├── providers/        # Context providers
│   │   ├── search/           # Search functionality
│   │   ├── settings/         # Settings components
│   │   ├── skillspace/       # Learning components
│   │   ├── thinkspace/       # Blog/content components
│   │   ├── ui/               # Base UI components (shadcn)
│   │   └── workshop/         # Workshop components
│   ├── context/              # React Context definitions
│   ├── hooks/                # Custom React hooks
│   ├── integrations/         # External service integrations
│   ├── lib/                  # Utility functions and helpers
│   ├── pages/                # Route page components
│   └── index.css             # Global styles and design tokens
├── supabase/
│   ├── functions/            # Edge functions
│   └── migrations/           # Database migrations
├── docs/                     # Documentation
└── public/                   # Static assets
```

## Authentication System

### Dual Authentication Support

AuraUp supports two authentication methods:

1. **Custom Authentication** (Primary)
   - Mobile number + OTP verification
   - Password-based sign-in
   - Session token management
   - 2FA with TOTP

2. **OAuth Authentication** (Secondary)
   - Google, GitHub, Facebook providers
   - Supabase Auth integration
   - Automatic profile creation

### Authentication Flow

```
User                    Frontend                Edge Function              Database
  │                         │                        │                        │
  ├── Enter credentials ───>│                        │                        │
  │                         ├── POST auth-signin ───>│                        │
  │                         │                        ├── Verify password ────>│
  │                         │                        │<─── User data ─────────┤
  │                         │                        ├── Generate OTP ───────>│
  │                         │<─── requiresOtp ───────┤                        │
  │<─── Show OTP input ─────┤                        │                        │
  ├── Enter OTP ───────────>│                        │                        │
  │                         ├── POST auth-verify ───>│                        │
  │                         │                        ├── Verify OTP ─────────>│
  │                         │                        ├── Create session ─────>│
  │                         │<─── session token ─────┤                        │
  │<─── Redirect to app ────┤                        │                        │
```

### Session Management

- Sessions stored in `user_sessions` table
- JWT-like session tokens (UUIDs)
- Automatic expiration (24 hours)
- Last activity tracking
- Multiple device support

### Role-Based Access Control (RBAC)

```sql
-- Roles stored in separate table (security best practice)
CREATE TABLE user_roles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    role app_role NOT NULL
);

-- Security function for RLS policies
CREATE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$ LANGUAGE SQL SECURITY DEFINER;
```

## API Layer

### Edge Functions

| Endpoint | Method | Description |
|----------|--------|-------------|
| `api-me` | GET | Get user profile & preferences |
| `api-me` | PATCH | Update user profile |
| `api-dashboard` | GET | Get dashboard data |
| `auth-signup` | POST | Register new user |
| `auth-signin` | POST | Sign in with credentials |
| `auth-verify-otp` | POST | Verify OTP code |
| `twofactor-generate` | POST | Generate 2FA secret |
| `twofactor-verify` | POST | Verify 2FA code |

### API Client Pattern

```typescript
// Centralized API client in src/lib/api.ts
export const api = {
  async getMe(): Promise<ApiResponse<MeResponse>> {
    return apiRequest('api-me', { method: 'GET' });
  },
  
  async updateMe(updates): Promise<ApiResponse<{ message: string }>> {
    return apiRequest('api-me', { method: 'PATCH', body: updates });
  },
};
```

## Dynamic Experience System

### Theme Variants

The platform supports multiple visual themes that change on each visit:

1. **AuraGlow** - Warm amber/gold tones
2. **NeoBlue** - Cool blue/cyan palette
3. **MistGreen** - Serene green tones
4. **VioletNova** - Purple/violet aesthetic
5. **OpalSilver** - Neutral silver/gray

### Animation Presets

1. **Calm** - Slow, smooth transitions
2. **Energetic** - Quick, bouncy animations
3. **Subtle** - Minimal, understated motion
4. **Expressive** - Bold, dramatic effects

### Implementation

```typescript
// Context-based experience management
const DynamicExperienceContext = createContext({
  theme: 'AuraGlow',
  animationPreset: 'calm',
  layoutVariant: 'default',
});
```

## State Management

### Client-Side State

1. **React Context** - Global app state
   - Theme preferences
   - Auth state
   - Dynamic experience settings

2. **React Query** - Server state
   - User profile data
   - Dashboard metrics
   - Cached API responses

3. **Local Storage** - Persistence
   - Session tokens
   - Navigation preferences
   - Theme settings

### State Flow

```
                    ┌──────────────────┐
                    │   React Query    │
                    │ (Server State)   │
                    └────────┬─────────┘
                             │
┌──────────────┐    ┌────────▼─────────┐    ┌──────────────┐
│   Context    │◄───│   Components     │───►│  localStorage│
│(Global State)│    │                  │    │(Persistence) │
└──────────────┘    └──────────────────┘    └──────────────┘
```

## Animation System

### Technologies

1. **Framer Motion** - Component animations
   - Layout animations
   - Page transitions
   - Micro-interactions

2. **GSAP** - Advanced animations
   - ScrollTrigger for scroll effects
   - ScrollSmoother for smooth scrolling
   - Complex timeline animations

### Animation Guidelines

- Respect `prefers-reduced-motion`
- Use GPU-accelerated properties
- Keep animations under 300ms for interactions
- Use spring physics for natural motion

## Security Measures

### Database Security

- Row Level Security (RLS) on all tables
- Separate roles table (prevents privilege escalation)
- Service role key only in edge functions
- No sensitive data in client code

### Authentication Security

- Passwords hashed with bcrypt
- OTP codes expire after 10 minutes
- Session tokens are UUIDs (not guessable)
- 2FA with TOTP support
- Rate limiting on auth endpoints

### Best Practices

1. Never store secrets in frontend code
2. Always verify tokens server-side
3. Use HTTPS for all requests
4. Implement proper CORS headers
5. Sanitize user inputs
6. Log security events

## Performance Optimization

### Frontend

- Code splitting per route
- Lazy loading for components
- Image optimization
- CSS purging with Tailwind
- React Query caching

### Backend

- Parallel data fetching (Promise.all)
- Database indexes on frequently queried columns
- Connection pooling via Supabase
- Edge function cold start optimization

## Testing Strategy

### Unit Tests
- Component rendering
- Hook behavior
- Utility functions

### Integration Tests
- API endpoints
- Auth flows
- Database operations

### E2E Tests
- User journeys
- Critical paths
- Cross-browser testing

## Deployment

### Frontend
- Vite build
- Static hosting (Lovable)
- CDN distribution

### Backend
- Supabase Edge Functions
- Automatic deployment on push
- Environment-based configuration

---

For more detailed documentation, see:
- [Authentication Flow](./AUTH.md)
- [Animation System](./ANIMATIONS.md)
- [API Reference](./API.md)
