# Testing Checklist for ovaboe.dev

## ✅ Authentication System

### Sign Up Flow
- [ ] Sign up form displays correctly with all fields (email, password, full name, role selector)
- [ ] Role selector shows all 3 options: Student, Professional, General User
- [ ] Form validation works (email format, password strength)
- [ ] Email verification email is sent successfully
- [ ] Email template displays correctly in inbox
- [ ] Verification link works and redirects to app
- [ ] User profile is created in profiles table
- [ ] User role is assigned in user_roles table
- [ ] Toast notifications show appropriate success/error messages
- [ ] Duplicate email shows proper error message

### Sign In Flow
- [ ] Sign in form displays correctly
- [ ] Valid credentials allow login
- [ ] Invalid credentials show error
- [ ] Unverified email shows "resend confirmation" option
- [ ] Resend confirmation works
- [ ] Auto-redirect to home page after successful login
- [ ] Session persists on page reload

### Sign Out
- [ ] Sign out button works
- [ ] User is redirected to auth page
- [ ] Session is cleared
- [ ] Protected routes redirect to auth

## 🌗 Dark Mode

- [ ] Dark mode toggle appears in navbar
- [ ] Toggle switches between light/dark/system modes
- [ ] Dark mode preference persists on reload
- [ ] All components respect dark mode
- [ ] No white text on white background issues
- [ ] No black text on black background issues
- [ ] Smooth transition between themes
- [ ] System preference detection works

## 🔍 Global Search

- [ ] Search bar appears in navbar
- [ ] Opens search modal on click
- [ ] Keyboard shortcut (Cmd/Ctrl+K) works
- [ ] Search input is debounced
- [ ] Results show for blogs
- [ ] Results show for courses
- [ ] Results show for community posts
- [ ] Clicking result navigates correctly
- [ ] ESC closes modal
- [ ] "No results" message displays when appropriate
- [ ] Search is responsive on mobile

## 🌀 Motion & Animations

### Lenis Smooth Scrolling
- [ ] Smooth scrolling works throughout site
- [ ] Performance is good (60fps)
- [ ] No jank or stuttering
- [ ] Works on all pages
- [ ] Disabled for users with reduced motion preference

### Framer Motion
- [ ] Page transitions work smoothly
- [ ] Navbar animations on scroll
- [ ] Card hover effects work
- [ ] Button animations work
- [ ] No layout shifts during animations
- [ ] Animations don't block interaction

## 📧 Email System

### Verification Email
- [ ] Email is received in inbox (not spam)
- [ ] Logo displays correctly
- [ ] CTA button is visible and clickable
- [ ] Email is mobile-responsive
- [ ] Verification link works
- [ ] Link expires after 24 hours

### Password Reset (if implemented)
- [ ] Reset email is sent
- [ ] Reset link works
- [ ] New password can be set
- [ ] User can log in with new password

## 🔐 Security

- [ ] Passwords are hashed
- [ ] RLS policies are enabled
- [ ] Users can only access their own data
- [ ] No sensitive data in console logs
- [ ] No API keys in client code
- [ ] CORS is properly configured
- [ ] Input validation works (XSS protection)
- [ ] SQL injection is prevented

## 🎯 SEO

- [ ] Title tag is set correctly
- [ ] Meta description is present
- [ ] Keywords meta tag is present
- [ ] OG tags for social sharing
- [ ] Twitter card tags
- [ ] Canonical URL is set
- [ ] Robots.txt is accessible
- [ ] Sitemap exists (if applicable)
- [ ] Page loads quickly (<3s)
- [ ] Mobile-friendly test passes

## 📱 Responsive Design

- [ ] Works on mobile (320px+)
- [ ] Works on tablet (768px+)
- [ ] Works on desktop (1024px+)
- [ ] Works on large screens (1920px+)
- [ ] Touch targets are large enough (44px+)
- [ ] Text is readable on all screen sizes
- [ ] Images scale properly
- [ ] Navigation works on mobile

## ⚡ Performance

- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.8s
- [ ] No console errors
- [ ] No console warnings
- [ ] Bundle size is optimized
- [ ] Images are optimized
- [ ] Lazy loading works
- [ ] No memory leaks

## 🧪 Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## 🔄 Edge Cases

- [ ] Works with slow internet
- [ ] Works offline (where applicable)
- [ ] Handles network errors gracefully
- [ ] Handles API errors gracefully
- [ ] Empty states display properly
- [ ] Loading states display properly
- [ ] Long text doesn't break layout
- [ ] Special characters in input work
- [ ] Copy/paste works in forms

## 📊 Database

- [ ] Migrations run successfully
- [ ] RLS policies are active
- [ ] Foreign keys are set correctly
- [ ] Indexes are in place for performance
- [ ] Data integrity is maintained
- [ ] No orphaned records

## 🚀 Pre-Deployment

- [ ] All environment variables are set
- [ ] Production API keys are configured
- [ ] Email sending is configured for production domain
- [ ] Error tracking is set up (if using)
- [ ] Analytics is set up (if using)
- [ ] Build succeeds without errors
- [ ] Build succeeds without warnings
- [ ] TypeScript has no errors
- [ ] ESLint has no errors

---

## Notes

- Test thoroughly in different environments
- Use different email providers for testing
- Test with real user scenarios
- Check mobile devices, not just browser dev tools
- Monitor performance in production
- Set up error logging for production issues
