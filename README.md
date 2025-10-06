# Professional Learning Platform

A comprehensive full-stack web application built with React, TypeScript, and Supabase, featuring authentication, role-based access control, content management, and interactive learning tools.

## 🚀 Features

### Core Functionality
- **Authentication System**: Secure user registration and login with email verification
- **Role-Based Access Control (RBAC)**: Admin, Moderator, and User roles with granular permissions
- **Content Management**: Create, edit, and publish blogs, courses, and community posts
- **Global Search**: Full-text search across blogs, courses, and community content
- **User Profiles**: Customizable profiles with privacy controls
- **Real-time Updates**: Live data synchronization using Supabase
- **Responsive Design**: Mobile-first, fully responsive UI

### Security Features
- **Row-Level Security (RLS)**: Database-level access control for all tables
- **Input Validation**: Comprehensive validation using Zod schemas
- **Protected Routes**: Client-side route protection for authenticated users
- **Audit Logging**: Track sensitive operations and security events
- **Privacy Controls**: User-configurable privacy settings for profiles
- **Password Requirements**: Enforced strong password policies

### Learning Features
- **SkillSpace**: Interactive coding environment with lessons and exercises
- **ThinkSpace**: Blog platform with categories, tags, and bookmarking
- **Workshop**: Live sessions, materials, and collaboration tools
- **Progress Tracking**: Monitor course completion and achievements
- **Badges System**: Earn badges for accomplishments

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Git for version control

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

The project is connected to Supabase with the following configuration:

- **Project ID**: `giasxieqdyyqvsmtibfr`
- **Supabase URL**: `https://giasxieqdyyqvsmtibfr.supabase.co`

Ensure your Supabase project has the following configured:

#### Database Tables
- `profiles` - User profile information
- `user_roles` - Role assignments
- `blogs` - Blog posts
- `blog_categories` - Blog categories
- `bookmarks` - User bookmarks
- `courses` - Course information
- `lessons` - Course lessons
- `user_progress` - Learning progress
- `user_badges` - Achievement badges
- `community_posts` - Community discussions
- `audit_logs` - Security audit trail

#### Authentication Settings

1. Navigate to **Authentication > URL Configuration** in Supabase Dashboard
2. Set **Site URL**: Your deployed application URL
3. Add **Redirect URLs**: 
   - `http://localhost:8080` (development)
   - Your production URL (when deployed)

#### Email Confirmation (Optional for Development)

To speed up testing, you can disable email confirmation:
1. Go to **Authentication > Providers > Email**
2. Disable "Confirm email" option

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 🏗️ Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/           # Authentication components
│   │   ├── dashboard/      # Dashboard widgets
│   │   ├── home/           # Home page components
│   │   ├── layout/         # Layout components (Navbar, Sidebar)
│   │   ├── profile/        # Profile page components
│   │   ├── search/         # Search functionality
│   │   ├── settings/       # Settings page components
│   │   ├── skillspace/     # Learning platform components
│   │   ├── thinkspace/     # Blog platform components
│   │   ├── workshop/       # Workshop components
│   │   └── ui/            # shadcn/ui components
│   ├── hooks/              # Custom React hooks
│   │   ├── useAuth.tsx    # Authentication hook
│   │   └── useDebounce.ts # Debounce utility
│   ├── lib/                # Utility functions and configs
│   │   ├── validations/   # Zod validation schemas
│   │   └── utils.ts       # Helper functions
│   ├── pages/              # Route pages
│   │   ├── Index.tsx      # Home page
│   │   ├── Auth.tsx       # Login/Signup page
│   │   ├── Profile.tsx    # User profile
│   │   ├── SkillSpace.tsx # Learning platform
│   │   ├── ThinkSpace.tsx # Blog platform
│   │   ├── Workshop.tsx   # Workshop page
│   │   ├── Settings.tsx   # User settings
│   │   └── NotFound.tsx   # 404 page
│   ├── integrations/       # External service integrations
│   │   └── supabase/      # Supabase client and types
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles and design tokens
├── supabase/
│   ├── functions/          # Edge functions (backend logic)
│   ├── migrations/         # Database migrations
│   └── config.toml         # Supabase configuration
├── public/                 # Static assets
└── package.json            # Project dependencies
```

## 🔐 Authentication & Authorization

### User Roles

The application implements a three-tier role system:

1. **User** (default): Basic access to create content and interact
2. **Moderator**: Can moderate content and manage community
3. **Admin**: Full system access including user management

### Role Assignment

Roles are managed through the `user_roles` table. New users automatically receive the "user" role upon registration.

To manually assign roles:

```sql
-- Make a user an admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin');
```

### Protected Features

- Blog creation requires authentication
- Blog editing restricted to authors or admins
- User profile editing restricted to profile owner
- Admin dashboard requires admin role

## 🔍 Search Functionality

The global search feature allows users to search across:
- Blog posts (title, content, excerpt)
- Courses (title, description)
- Community posts (title, content)

**Usage**:
- Click the search button in the navbar
- Or use keyboard shortcut: `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)

Search is debounced (300ms) and returns results in real-time as you type.

## 🎨 Design System

The application uses a semantic token-based design system defined in:
- `src/index.css` - CSS custom properties and design tokens
- `tailwind.config.ts` - Tailwind configuration

### Color Tokens
All colors use HSL format and semantic naming:
- `--primary` - Primary brand color
- `--secondary` - Secondary accents
- `--background` - Page background
- `--foreground` - Text color
- `--muted` - Muted backgrounds
- `--accent` - Accent elements

### Dark Mode
Automatic dark mode support using CSS variables and the `ThemeProvider`.

## 📊 Database Schema

### Key Tables

**profiles**
- User profile information (username, bio, avatar, etc.)
- Privacy controls (public/private)
- RLS: Users can view own profile; public profiles viewable with limited info

**user_roles**
- Role assignments (admin, moderator, user)
- RLS: Users can view own roles; admins can manage all

**blogs**
- Blog posts with categories, tags, and metadata
- RLS: Authors view own; published blogs public; admins can moderate

**courses & lessons**
- Course structure and lesson content
- RLS: All viewable by authenticated users

**user_progress**
- Track course completion and scores
- RLS: Users can view/update own progress

**audit_logs**
- Security event logging
- RLS: Admin-only access

## 🧪 Testing Guidelines

### Manual Testing Checklist

#### Authentication
- [ ] Sign up with valid email
- [ ] Sign in with credentials
- [ ] Sign out functionality
- [ ] Protected routes redirect to login
- [ ] Email validation works
- [ ] Password strength requirements enforced

#### Authorization
- [ ] Users can only edit own content
- [ ] Admins can moderate all content
- [ ] Role-based features display correctly

#### Search
- [ ] Search returns relevant results
- [ ] Search works across all content types
- [ ] Keyboard shortcut functions
- [ ] Empty state displays correctly

#### Security
- [ ] RLS policies prevent unauthorized access
- [ ] Input validation catches invalid data
- [ ] XSS attempts are prevented
- [ ] Session management works correctly

### Future Testing Implementation

For production deployment, consider adding:
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Playwright or Cypress
- **E2E Tests**: Full user flow testing
- **Load Testing**: Performance under high traffic
- **Security Audit**: Regular vulnerability scans

## 🚀 Deployment

### Deploy to Lovable

1. Open your project in Lovable
2. Click **Publish** in the top right
3. Your app will be deployed with a `*.lovable.app` domain

### Custom Domain

1. Navigate to **Project > Settings > Domains**
2. Click **Connect Domain**
3. Follow the DNS configuration steps

### Environment Variables

No frontend environment variables are needed as the Supabase configuration is committed. For production:
- Ensure Supabase URL and keys are configured
- Update authentication redirect URLs
- Configure custom domain in Supabase

## 📝 API Documentation

### Supabase Client Usage

```typescript
import { supabase } from "@/integrations/supabase/client";

// Query data
const { data, error } = await supabase
  .from('blogs')
  .select('*')
  .eq('published', true);

// Insert data
const { error } = await supabase
  .from('blogs')
  .insert({ title: 'New Post', content: '...' });

// Authentication
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

### Role Checking

```typescript
import { useAuth } from "@/hooks/useAuth";

const { hasRole } = useAuth();

// Check if user has admin role
const isAdmin = await hasRole('admin');
```

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

### Code Standards

- Use TypeScript for all new files
- Follow existing component structure
- Use semantic CSS tokens from design system
- Validate all user inputs with Zod
- Write clear, descriptive commit messages

### Security Considerations

- Never commit secrets or API keys
- Always use RLS policies for new tables
- Validate inputs on both client and server
- Use the `has_role()` function for authorization checks
- Whitelist fields in update operations

## 📚 Resources

- [Lovable Documentation](https://docs.lovable.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Requested path is invalid" on login
- **Solution**: Check Authentication > URL Configuration in Supabase. Ensure Site URL and Redirect URLs are set correctly.

**Issue**: Can't see my data after login
- **Solution**: Check RLS policies. Ensure your user has proper permissions.

**Issue**: Database migration failed
- **Solution**: Check for syntax errors. Ensure migrations run in order.

**Issue**: Search not working
- **Solution**: Verify that tables have proper indexes. Check browser console for errors.

## 📄 License

This project is part of a Lovable project. See [Lovable Terms](https://lovable.dev/terms) for details.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Backend powered by [Supabase](https://supabase.com)
- Icons from [Lucide](https://lucide.dev)

---

For more information or support, visit [Lovable Documentation](https://docs.lovable.dev/) or join the [Discord community](https://discord.gg/lovable).
