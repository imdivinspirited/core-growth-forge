# AuraUp - Professional Development Platform

A comprehensive professional development and personal branding platform built with React, TypeScript, Supabase, and modern web technologies.

## 🚀 Overview

AuraUp is a full-stack professional development platform featuring:
- **Custom Authentication System** - Mobile-first with OTP, OAuth, and 2FA
- **Dashboard** - Centralized hub for profile, progress, badges, and achievements
- **Courses** - Interactive learning with progress tracking
- **Services** - Professional service offerings
- **Modern UI** - GSAP animations, Three.js effects, responsive design

## ✨ Key Features

### 🏠 Home Page
- Hero section with GSAP ScrollSmoother and Three.js 3D effects
- Smooth scrolling with professional animations
- Featured content and announcements
- Quick access tools and trending content

### 📚 Courses
- Interactive course catalog
- Progress tracking
- Lesson management
- Difficulty-based filtering

### 💼 Services
- Professional service offerings
- Booking management
- Vendor integration

### 📊 Dashboard
Centralized hub including:
- **Profile** - Personal information management
- **Progress** - Learning progress visualization
- **Badges** - Achievement badges and certifications
- **Certificates** - Earned certificates display
- **Statistics** - LeetCode-style progress graphs
- **Achievements** - Milestone tracking
- **Social Share** - LinkedIn integration

### ⚙️ Settings
- **Appearance** - Dark/Light mode toggle (persistent)
- **Preferences** - Notification and language settings
- **Account** - Account management
- **Security** - Two-Factor Authentication setup

### 🔐 Authentication System

#### Authentication Methods
1. **Mobile Number Authentication**
   - Sign up/sign in with mobile number and password
   - Real-time OTP verification via SMS (Twilio)
   - Secure password hashing (SHA-256)
   - Rate limiting: 5 OTP/hour, 1/minute per mobile

2. **OAuth Integration**
   - Google Sign-In
   - GitHub Sign-In
   - Facebook Sign-In

3. **Two-Factor Authentication (2FA)**
   - TOTP-based (Google Authenticator, Authy, etc.)
   - QR code setup
   - Recovery codes (10 per activation)
   - Sign-in challenge for 2FA users

#### Security Features
- Password security with SHA-256 hashing
- Rate limiting to prevent brute force
- JWT-like session tokens with refresh
- Row-Level Security (RLS) policies
- Email notifications for security events
- Audit logging

### 🔔 Notifications
- Email alerts via **Resend API**
- New device sign-in alerts
- Password change confirmations
- 2FA activation notifications

### 🔧 Admin Features
- Admin Auth Center (`/admin/auth-center`)
- Session management
- User role management
- Audit log viewing

## 🎨 Design System

### Color Palette
- Modern, clean palette with HSL colors
- Full dark mode support
- Semantic tokens for consistency
- Glass effects and gradients

### Animations
- GSAP ScrollSmoother for smooth scrolling
- Framer Motion for component animations
- Three.js for 3D effects
- Respects `prefers-reduced-motion`

### Navigation
- Fixed navbar with show/hide toggle
- Persistent visibility preference
- Mobile-responsive menu
- Global search functionality

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **GSAP** - Advanced animations
- **Three.js** - 3D graphics
- **React Router** - Navigation
- **TanStack Query** - Data fetching
- **Shadcn/ui** - Component library

### Backend
- **Supabase** - Backend as a Service
- **Edge Functions** - Serverless functions (Deno)
- **PostgreSQL** - Database
- **Row-Level Security** - Data protection

### External Services
- **Twilio** - SMS OTP delivery
- **Resend** - Email notifications

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd auraup

# Install dependencies
npm install

# Start development server
npm run dev
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Secrets

Add the following secrets in Supabase Dashboard:

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
RESEND_API_KEY=re_xxxxxxxxxxxx
```

### OAuth Setup

#### Google
1. Create project at [Google Cloud Console](https://console.cloud.google.com/)
2. Configure OAuth consent screen
3. Add callback URL from Supabase Dashboard
4. Configure in Supabase: Settings → Auth → Providers → Google

#### GitHub
1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create new OAuth app
3. Set callback URL from Supabase Dashboard
4. Configure in Supabase: Settings → Auth → Providers → GitHub

#### Facebook
1. Create app at [Facebook Developers](https://developers.facebook.com/)
2. Add Facebook Login product
3. Set OAuth redirect URI
4. Configure in Supabase: Settings → Auth → Providers → Facebook

## 📁 Project Structure

```
/
├── public/                  # Static assets
├── src/
│   ├── assets/             # Images, fonts
│   ├── components/
│   │   ├── animations/     # Animation components
│   │   ├── auth/           # Auth components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── home/           # Home page components
│   │   ├── layout/         # Layout components (Navbar, Sidebar)
│   │   ├── profile/        # Profile components
│   │   ├── search/         # Search components
│   │   ├── settings/       # Settings components
│   │   ├── skillspace/     # Learning components
│   │   ├── thinkspace/     # Blog components
│   │   ├── ui/             # UI components (Shadcn)
│   │   └── workshop/       # Workshop components
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # Third-party integrations
│   ├── lib/                # Utility functions
│   └── pages/              # Page components
├── supabase/
│   ├── functions/          # Edge functions
│   │   ├── auth-signup/
│   │   ├── auth-signin/
│   │   ├── auth-verify-otp/
│   │   ├── auth-forgot-password/
│   │   ├── auth-reset-password/
│   │   ├── auth-session/
│   │   ├── auth-signout/
│   │   ├── twofactor-generate/
│   │   ├── twofactor-verify/
│   │   ├── twofactor-signin/
│   │   ├── twofactor-disable/
│   │   ├── send-security-alert/
│   │   └── send-notification/
│   └── migrations/         # Database migrations
└── index.html
```

## 📡 API Endpoints

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth-signup` | POST | Create new user account |
| `/auth-signin` | POST | Sign in with credentials |
| `/auth-verify-otp` | POST | Verify OTP code |
| `/auth-session` | POST | Validate session token |
| `/auth-signout` | POST | End user session |
| `/auth-forgot-password` | POST | Request password reset |
| `/auth-reset-password` | POST | Reset password with OTP |

### Two-Factor Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/twofactor-generate` | POST | Generate 2FA secret & QR |
| `/twofactor-verify` | POST | Verify TOTP & enable 2FA |
| `/twofactor-signin` | POST | Verify 2FA during sign-in |
| `/twofactor-disable` | POST | Disable 2FA |

## 🗄️ Database Schema

### Core Tables
- **custom_users** - User accounts
- **profiles** - User profiles
- **user_sessions** - Active sessions
- **user_roles** - Role assignments
- **otp_codes** - OTP storage
- **two_factor_settings** - 2FA configuration
- **two_factor_recovery_codes** - Recovery codes
- **audit_logs** - Security events

### Content Tables
- **courses** - Course catalog
- **lessons** - Course lessons
- **user_progress** - Learning progress
- **blogs** - Blog posts
- **community_posts** - Community content
- **bookmarks** - User bookmarks

### Business Tables
- **vendors** - Service vendors
- **bookings** - Service bookings
- **payments** - Payment records
- **notifications** - User notifications

## 🔒 Security

### Implemented Measures
- ✅ SHA-256 password hashing
- ✅ OTP verification for sensitive operations
- ✅ Rate limiting (5 OTP/hour, 1/minute)
- ✅ JWT-like session tokens
- ✅ Row-Level Security (RLS)
- ✅ Two-Factor Authentication
- ✅ Email security alerts
- ✅ Audit logging

### Production Recommendations
- Use HTTPS only
- Monitor failed auth attempts
- Set up SMS/email monitoring
- Configure SPF/DKIM/DMARC
- Regular audit log reviews

## 🧪 Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Testing
- Unit tests in `/testing/unit`
- Integration tests in `/testing/integration`
- E2E tests in `/testing/e2e`

## 📈 Performance

### Optimization Targets
- Lighthouse score: 90+ all categories
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1

### Implemented Optimizations
- Code splitting
- Lazy loading for routes
- Image optimization
- Font preloading
- Minified assets
- Tree shaking

## 🌐 Deployment

### Production Build
```bash
npm run build
```

### Environment Requirements
- Node.js 18+
- npm 9+

## 📄 License

MIT

## 🆘 Support

For issues or questions, please open an issue on the repository.

## 🔗 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Twilio API Reference](https://www.twilio.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [GSAP Documentation](https://gsap.com/docs)
- [Three.js Documentation](https://threejs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
