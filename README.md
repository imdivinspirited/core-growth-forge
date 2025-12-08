# AuraUp - Professional Development Platform

A comprehensive, production-grade professional development and personal branding platform built with React, TypeScript, Supabase, and modern web technologies. Features an advanced **Dynamic Experience System** that provides fresh, engaging experiences on every visit.

---

## 🚀 Overview

AuraUp is a full-stack professional development platform featuring:

- **Custom Authentication System** - Mobile-first with OTP, OAuth, and 2FA
- **Dynamic Experience System** - Fresh layouts, themes, and animations on each visit
- **Global Navigation** - Fixed, hideable navbar with smooth Framer Motion transitions
- **Dashboard Panel** - Slide-in dashboard accessed via profile avatar
- **Interactive Courses** - Progress tracking with coding challenges
- **ThinkSpace** - Blogging and community engagement
- **Modern UI** - GSAP animations, Three.js effects, responsive design

---

## ✨ Architecture

### Dynamic Experience System

The core of AuraUp's engagement strategy. Every visit feels fresh through controlled variation:

```
┌─────────────────────────────────────────────────────────────┐
│                  DynamicExperienceProvider                  │
├─────────────────────────────────────────────────────────────┤
│  Theme Variants (5)    │  Layout Variants (4)               │
│  ├── AuraGlow          │  ├── Hero Layout 1-4               │
│  ├── NeoBlue           │  └── Feature Grid variations       │
│  ├── MistGreen         │                                    │
│  ├── VioletNova        │  Animation Presets (4)             │
│  └── OpalSilver        │  ├── Calm, Energetic               │
│                        │  └── Subtle, Expressive            │
├─────────────────────────────────────────────────────────────┤
│  Dynamic Content System                                      │
│  ├── getDynamicText('heroTagline')                          │
│  ├── getDynamicTextMultiple('testimonialQuotes', 3)         │
│  └── useDynamicContent() hook                               │
└─────────────────────────────────────────────────────────────┘
```

#### Key Files:
- `src/context/DynamicExperienceContext.tsx` - Provider & state management
- `src/lib/dynamicContent.ts` - Content variant pools & selection logic

### Navigation System

Modern fixed navigation with show/hide capability:

```
┌────────────────────────────────────────────────────────────┐
│  GlobalNavigation (Fixed Header)                           │
├────────────────────────────────────────────────────────────┤
│  [≡] Logo   │  Home  AuraLearn  ThinkSpace  │  [👤] [🔍]  │
├────────────────────────────────────────────────────────────┤
│                    ↓ Profile Avatar Click                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           DashboardPanel (Slide-in)                   │  │
│  │  ┌─────────┬─────────┬─────────┬─────────┐           │  │
│  │  │Progress │ Badges  │ Stats   │Settings │           │  │
│  │  └─────────┴─────────┴─────────┴─────────┘           │  │
│  │                                                       │  │
│  │  [Profile Overview]  [Achievements]  [Actions]        │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

#### Key Files:
- `src/components/layout/GlobalNavigation.tsx` - Main navigation
- `src/components/dashboard/DashboardPanel.tsx` - Slide-in dashboard

### Logo System

Three.js-powered animated logo with particle aura effects:

```tsx
// Usage
<AuraUpLogo size="sm" />                    // Navbar
<AuraUpLogo variant="hero" showTagline />   // Hero section
```

#### Features:
- Particle aura field (WebGL)
- Glowing core with pulsing animation
- Rising arrow element
- Interactive hover/click effects
- Static SVG fallback for low-power devices

---

## 📁 Project Structure

```
auraup/
├── public/                      # Static assets
│   ├── robots.txt
│   └── favicon.ico
│
├── src/
│   ├── assets/                  # Images, fonts, generated assets
│   │
│   ├── components/
│   │   ├── animations/          # Reusable animation components
│   │   │   ├── AnimatedButton.tsx
│   │   │   ├── AnimatedCard.tsx
│   │   │   ├── FadeInWhenVisible.tsx
│   │   │   ├── GradientOrb.tsx
│   │   │   ├── PageTransition.tsx
│   │   │   ├── ParallaxBackground.tsx
│   │   │   ├── Preloader.tsx
│   │   │   └── StaggeredList.tsx
│   │   │
│   │   ├── auth/                # Authentication components
│   │   │   └── ProtectedRoute.tsx
│   │   │
│   │   ├── dashboard/           # Dashboard components
│   │   │   ├── DashboardPanel.tsx
│   │   │   ├── PerformanceAnalytics.tsx
│   │   │   ├── ProfileOverview.tsx
│   │   │   └── QuickLinks.tsx
│   │   │
│   │   ├── home/                # Homepage sections
│   │   │   ├── HeroSection.tsx  # Enhanced with GSAP + Three.js
│   │   │   ├── FeaturedContent.tsx
│   │   │   ├── QuickAccessTools.tsx
│   │   │   └── TrendingContent.tsx
│   │   │
│   │   ├── layout/              # Layout components
│   │   │   └── GlobalNavigation.tsx
│   │   │
│   │   ├── logo/                # Brand logo system
│   │   │   └── AuraUpLogo.tsx   # Three.js animated logo
│   │   │
│   │   ├── profile/             # User profile components
│   │   ├── search/              # Global search
│   │   ├── settings/            # Settings panels
│   │   ├── skillspace/          # AuraLearn components
│   │   ├── thinkspace/          # Blog/community components
│   │   ├── ui/                  # Shadcn UI components
│   │   └── workshop/            # Workshop components
│   │
│   ├── context/
│   │   └── DynamicExperienceContext.tsx  # Theme/layout/animation state
│   │
│   ├── hooks/
│   │   ├── useAuth.tsx          # Supabase auth hook
│   │   ├── useCustomAuth.tsx    # Custom auth system hook
│   │   ├── use2FA.tsx           # Two-factor auth hook
│   │   ├── useDebounce.ts       # Debounce utility
│   │   ├── useReducedMotion.ts  # Accessibility: prefers-reduced-motion
│   │   └── use-toast.ts         # Toast notifications
│   │
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts        # Supabase client instance
│   │       └── types.ts         # Generated TypeScript types
│   │
│   ├── lib/
│   │   ├── animations.ts        # Shared animation configs
│   │   ├── dynamicContent.ts    # Dynamic text system
│   │   ├── seo.ts               # SEO utilities
│   │   ├── utils.ts             # General utilities (cn, etc.)
│   │   └── validations/
│   │       └── auth.ts          # Zod validation schemas
│   │
│   ├── pages/
│   │   ├── Index.tsx            # Homepage
│   │   ├── Auth.tsx             # Authentication page
│   │   ├── Dashboard.tsx        # User dashboard
│   │   ├── AuraLearn.tsx        # Learning platform
│   │   ├── Courses.tsx          # Course catalog
│   │   ├── ThinkSpace.tsx       # Blog/community
│   │   ├── Profile.tsx          # User profile
│   │   ├── Services.tsx         # Services page
│   │   ├── Settings.tsx         # Settings page
│   │   ├── Workshop.tsx         # Workshop hub
│   │   ├── Chat.tsx             # Real-time chat
│   │   ├── Tourism.tsx          # Tourism feed
│   │   ├── AdminDashboard.tsx   # Admin panel
│   │   ├── AdminAuthCenter.tsx  # Auth management
│   │   └── NotFound.tsx         # 404 page
│   │
│   ├── App.tsx                  # Root component with providers
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles & design tokens
│
├── supabase/
│   ├── config.toml              # Supabase configuration
│   ├── functions/               # Edge Functions (Deno)
│   │   ├── auth-signup/
│   │   ├── auth-signin/
│   │   ├── auth-verify-otp/
│   │   ├── auth-session/
│   │   ├── auth-signout/
│   │   ├── auth-forgot-password/
│   │   ├── auth-reset-password/
│   │   ├── twofactor-generate/
│   │   ├── twofactor-verify/
│   │   ├── twofactor-signin/
│   │   ├── twofactor-disable/
│   │   ├── send-auth-email/
│   │   ├── send-notification/
│   │   ├── send-security-alert/
│   │   └── ai-recommendations/
│   └── migrations/              # Database migrations (read-only)
│
├── index.html
├── tailwind.config.ts           # Tailwind + design tokens
├── vite.config.ts               # Vite configuration
└── package.json
```

---

## 🎨 Design System

### Design Tokens (index.css)

All styling uses semantic tokens for consistency:

```css
:root {
  /* Core Colors */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  
  /* Semantic Colors */
  --muted: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  
  /* Custom Gradients */
  --gradient-primary: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary)/0.7));
  --gradient-hero: linear-gradient(180deg, hsl(var(--background)), hsl(var(--muted)));
}
```

### Theme Switching

Managed via DarkModeSettings in Dashboard:
- Light / Dark / System
- Persisted in localStorage
- Respects `prefers-color-scheme`

---

## 🔐 Authentication System

### Authentication Methods

1. **Mobile Number Authentication**
   - Sign up/sign in with mobile + password
   - OTP verification via Twilio SMS
   - Rate limiting: 5 OTP/hour, 1/minute

2. **OAuth Integration**
   - Google, GitHub, Facebook
   - Automatic profile creation

3. **Two-Factor Authentication**
   - TOTP-based (Google Authenticator, Authy)
   - QR code setup with recovery codes
   - Sign-in challenge flow

### Security Features

- SHA-256 password hashing
- JWT-like session tokens with refresh
- Row-Level Security (RLS) on all tables
- Audit logging for security events
- Email alerts via Resend API

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Framer Motion | Component animations |
| GSAP + ScrollTrigger | Scroll animations |
| Three.js / R3F | 3D graphics (logo) |
| React Router v6 | Routing |
| TanStack Query | Data fetching |
| Shadcn/ui | UI components |

### Backend
| Technology | Purpose |
|------------|---------|
| Supabase | BaaS (Auth, DB, Storage) |
| Edge Functions (Deno) | Serverless functions |
| PostgreSQL | Database |
| Row-Level Security | Data protection |

### External Services
| Service | Purpose |
|---------|---------|
| Twilio | SMS OTP delivery |
| Resend | Email notifications |

---

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

### Supabase Secrets

Add in Supabase Dashboard → Settings → Edge Functions:

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
RESEND_API_KEY=re_xxxxxxxxxxxx
```

### OAuth Setup

1. **Google**: Create OAuth app in Google Cloud Console
2. **GitHub**: Create OAuth app in Developer Settings
3. Configure callback URLs in Supabase Auth settings

---

## 📡 API Endpoints

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth-signup` | POST | Create new user |
| `/auth-signin` | POST | Sign in |
| `/auth-verify-otp` | POST | Verify OTP |
| `/auth-session` | POST | Validate session |
| `/auth-signout` | POST | End session |

### Two-Factor
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/twofactor-generate` | POST | Generate 2FA QR |
| `/twofactor-verify` | POST | Enable 2FA |
| `/twofactor-signin` | POST | 2FA challenge |
| `/twofactor-disable` | POST | Disable 2FA |

---

## 🗄️ Database Schema

### Core Tables
- `custom_users` - User accounts
- `profiles` - User profiles
- `user_sessions` - Active sessions
- `user_roles` - RBAC (admin, moderator, user)
- `otp_codes` - OTP storage
- `two_factor_settings` - 2FA config
- `audit_logs` - Security events

### Content Tables
- `courses` - Course catalog
- `lessons` - Course lessons
- `user_progress` - Learning progress
- `user_badges` - Achievements
- `blogs` - Blog posts
- `community_posts` - Community content
- `bookmarks` - User bookmarks

### Business Tables
- `vendors` - Service vendors
- `bookings` - Service bookings
- `payments` - Payment records
- `notifications` - User notifications
- `fraud_alerts` - Security alerts

---

## 🎬 Animation System

### GSAP Integration
- ScrollTrigger for scroll-based animations
- Timeline sequencing for hero effects
- Parallax backgrounds

### Framer Motion
- Page transitions (AnimatePresence)
- Component enter/exit animations
- Layout animations

### Three.js / React Three Fiber
- AuraUpLogo particle effects
- Interactive 3D elements
- WebGL fallback handling

### Accessibility
- Respects `prefers-reduced-motion`
- Motion preferences in Settings
- Static fallbacks for complex animations

---

## 📈 Performance

### Optimization Targets
- Lighthouse: 90+ all categories
- FCP: < 1.5s
- TTI: < 3s
- CLS: < 0.1

### Implemented Optimizations
- Code splitting
- Image optimization
- Font preloading
- Tree shaking
- GPU-accelerated animations

---

## 🧪 Development

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview build
npm run preview

# Type checking
npm run typecheck

# Linting
npm run lint
```

---

## 🔒 Security

### Implemented Measures
- ✅ Password hashing (SHA-256)
- ✅ OTP verification
- ✅ Rate limiting
- ✅ JWT session tokens
- ✅ Row-Level Security (RLS)
- ✅ Two-Factor Authentication
- ✅ Email security alerts
- ✅ Audit logging

### Best Practices
- Never store roles in profile table
- Use service role only in edge functions
- Validate all inputs with Zod
- HTTPS only in production

---

## 📄 License

MIT

---

## 🔗 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Twilio API Reference](https://www.twilio.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [GSAP Documentation](https://gsap.com/docs)
- [Three.js Documentation](https://threejs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Shadcn/ui](https://ui.shadcn.com/)
