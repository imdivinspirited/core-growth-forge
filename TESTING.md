# Complete Testing Guide

## Manual Testing Checklist

### 🔐 Authentication Flow

#### Sign Up
- [ ] Navigate to `/auth`
- [ ] Fill in all fields (email, password, full name)
- [ ] Select role (student, professional, user)
- [ ] Submit form
- [ ] Verify success toast appears
- [ ] Check email inbox for verification link
- [ ] Click verification link
- [ ] Verify redirect to home page
- [ ] Check database: `profiles` table has new row
- [ ] Check database: `user_roles` table has correct role
- [ ] **Error Cases**:
  - [ ] Try duplicate email (should show error)
  - [ ] Try weak password < 8 chars (should show error)
  - [ ] Leave fields empty (should show validation errors)
  - [ ] Try invalid email format (should show error)

#### Sign In
- [ ] Navigate to `/auth`
- [ ] Switch to "Sign In" tab
- [ ] Enter verified credentials
- [ ] Click "Sign In"
- [ ] Verify success toast
- [ ] Verify redirect to home page
- [ ] Check session persists after page refresh
- [ ] **Error Cases**:
  - [ ] Try unverified email (should show error + resend option)
  - [ ] Try wrong password (should show error)
  - [ ] Try non-existent email (should show error)
  - [ ] Click "resend confirmation" (should send email)

#### Sign Out
- [ ] While signed in, click sign out button
- [ ] Verify success toast
- [ ] Verify redirect to home or auth page
- [ ] Verify session is cleared
- [ ] Try accessing protected route (should redirect to auth)
- [ ] Refresh page (should remain signed out)

### 📧 Email System (Resend API)

#### Email Templates
- [ ] **Signup Email**:
  - [ ] Received within 1 minute
  - [ ] Has branded design (logo, colors)
  - [ ] Verification button/link works
  - [ ] Email from `noreply@ovaboe.dev`
  - [ ] Subject line is professional
  - [ ] Mobile responsive design
  - [ ] Footer has correct information
- [ ] **Password Reset** (if implemented):
  - [ ] Email received
  - [ ] Reset link works
  - [ ] Link expires after use
- [ ] Check spam folder if emails missing
- [ ] Verify sender reputation (not marked as spam)

#### Email Delivery
- [ ] Check Resend dashboard for delivery status
- [ ] Verify webhook logs in Supabase edge function logs
- [ ] Test resend functionality for undelivered emails
- [ ] Verify email rate limits not exceeded

### 🌗 UI/UX Testing

#### Dark Mode
- [ ] Click dark mode toggle in navbar
- [ ] Verify all colors change appropriately
- [ ] Check all components are readable
- [ ] Verify images/logos adapt (if applicable)
- [ ] Refresh page (preference should persist)
- [ ] Test system preference detection:
  - [ ] Set OS to dark mode
  - [ ] Set theme to "system"
  - [ ] Verify app follows OS preference
- [ ] Check smooth transition between themes (no flashing)
- [ ] Verify localStorage stores preference

#### Global Search
- [ ] **Opening Search**:
  - [ ] Press `Cmd/Ctrl + K` (should open)
  - [ ] Click search button (should open)
  - [ ] Press `Escape` (should close)
  - [ ] Click outside (should close)
- [ ] **Search Functionality**:
  - [ ] Type query (wait for debounce ~300ms)
  - [ ] Verify results appear from blogs, courses, community
  - [ ] Click result (should navigate correctly)
  - [ ] Test autocomplete/suggestions
  - [ ] Verify "no results" state shows correctly
  - [ ] Test with special characters
  - [ ] Test with very long query
- [ ] **Recent Searches**:
  - [ ] Search for something
  - [ ] Close and reopen search
  - [ ] Verify recent searches appear
  - [ ] Click recent search (should populate input)
  - [ ] Click "Clear" (should remove all recent)
- [ ] **Performance**:
  - [ ] Type quickly (should debounce properly)
  - [ ] Verify no duplicate API calls
  - [ ] Check console for errors
- [ ] **Mobile**:
  - [ ] Test on mobile viewport
  - [ ] Verify keyboard opens smoothly
  - [ ] Check touch interactions
  - [ ] Verify results are scrollable

#### Motion & Animations
- [ ] **Lenis Smooth Scrolling**:
  - [ ] Scroll page (should be smooth)
  - [ ] Verify no janky movements
  - [ ] Test on different browsers
  - [ ] Check performance (60fps)
- [ ] **Page Transitions**:
  - [ ] Navigate between pages
  - [ ] Verify fade transitions
  - [ ] No layout shift during transition
- [ ] **Scroll Animations** (GSAP):
  - [ ] Scroll down page
  - [ ] Verify elements fade in as they appear
  - [ ] Check parallax effects (if any)
  - [ ] Verify animations don't replay on scroll up
- [ ] **Framer Motion**:
  - [ ] Hover over cards (should scale)
  - [ ] Stagger animations on lists
  - [ ] Button hover effects
- [ ] **Reduced Motion**:
  - [ ] Enable "Reduce Motion" in OS settings
  - [ ] Verify animations are minimal/disabled
  - [ ] App should still be usable

### ⚡ Performance Testing

#### Frontend
- [ ] Run Lighthouse audit:
  - [ ] Performance > 90
  - [ ] Accessibility > 90
  - [ ] Best Practices > 90
  - [ ] SEO > 90
- [ ] Check bundle size:
  ```bash
  npm run build
  # Check dist/assets/*.js sizes
  ```
- [ ] Verify no memory leaks (Chrome DevTools Memory tab)
- [ ] Test on slow 3G network (DevTools Network throttling)
- [ ] Check Core Web Vitals:
  - [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] FID (First Input Delay) < 100ms
  - [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] No console errors
- [ ] No console warnings
- [ ] Images lazy load properly

#### Backend
- [ ] Edge functions deploy successfully
- [ ] Check Supabase edge function logs (no errors)
- [ ] Database queries complete in < 500ms
- [ ] Email delivery time < 5 seconds
- [ ] RLS policies don't slow down queries significantly

### 🔍 SEO Testing

- [ ] **Meta Tags** (check view-source):
  - [ ] `<title>` tag present and unique per page
  - [ ] `<meta name="description">` under 160 chars
  - [ ] Open Graph tags for social sharing
  - [ ] Twitter card tags
  - [ ] Canonical URL set
- [ ] **HTML Structure**:
  - [ ] Only one `<h1>` per page
  - [ ] Headings in correct order (h1 → h2 → h3)
  - [ ] Semantic HTML (`<nav>`, `<main>`, `<article>`, etc.)
- [ ] **Images**:
  - [ ] All images have `alt` attributes
  - [ ] Alt text is descriptive
  - [ ] Images are optimized (< 200KB each)
- [ ] **Mobile Friendly**:
  - [ ] Viewport meta tag present
  - [ ] Text readable without zooming
  - [ ] Tap targets are large enough
  - [ ] No horizontal scrolling
- [ ] **Performance for SEO**:
  - [ ] Page loads in < 3 seconds
  - [ ] No render-blocking resources
  - [ ] Critical CSS inlined
- [ ] Test with Google Search Console (post-deployment)

### 🌐 Browser Compatibility

Test on:
- [ ] Chrome (latest) - Desktop
- [ ] Firefox (latest) - Desktop
- [ ] Safari (latest) - Desktop
- [ ] Edge (latest) - Desktop
- [ ] Chrome Mobile - Android
- [ ] Safari Mobile - iOS
- [ ] Samsung Internet - Android

For each browser:
- [ ] Authentication works
- [ ] Dark mode works
- [ ] Search works
- [ ] Animations are smooth
- [ ] No visual glitches
- [ ] No console errors

### ♿ Accessibility Testing

- [ ] **Keyboard Navigation**:
  - [ ] Tab through all interactive elements
  - [ ] Enter/Space activate buttons
  - [ ] Escape closes modals/search
  - [ ] No keyboard traps
- [ ] **Screen Reader** (NVDA/VoiceOver):
  - [ ] All images have alt text
  - [ ] Form labels are read
  - [ ] Buttons have descriptive text
  - [ ] Headings are announced correctly
  - [ ] ARIA labels where needed
- [ ] **Color Contrast** (WCAG AA):
  - [ ] Text contrast ratio > 4.5:1
  - [ ] Interactive elements contrast > 3:1
  - [ ] Test in both light and dark modes
- [ ] **Focus Indicators**:
  - [ ] Visible focus ring on interactive elements
  - [ ] Focus ring color has good contrast
- [ ] **Forms**:
  - [ ] All inputs have labels
  - [ ] Error messages are clear
  - [ ] Required fields marked
  - [ ] Instructions provided
- [ ] Run axe DevTools (Chrome extension)
- [ ] Run WAVE accessibility checker

### 🔒 Security Testing

- [ ] **Authentication**:
  - [ ] Cannot access protected routes when logged out
  - [ ] Session expires after timeout
  - [ ] Logout clears all session data
  - [ ] Cannot bypass email verification
- [ ] **Authorization**:
  - [ ] Users can only see their own data
  - [ ] Role-based access enforced (student, professional, user)
  - [ ] Admin routes require admin role
  - [ ] RLS policies prevent unauthorized access
- [ ] **Input Validation**:
  - [ ] Try SQL injection in forms: `' OR '1'='1`
  - [ ] Try XSS in forms: `<script>alert('XSS')</script>`
  - [ ] Long strings don't break UI
  - [ ] Special characters handled correctly
- [ ] **Headers** (check with curl or DevTools):
  - [ ] `X-Frame-Options: DENY`
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `Strict-Transport-Security` (in production)
  - [ ] `Content-Security-Policy` (recommended)
- [ ] **Secrets**:
  - [ ] No API keys in client-side code
  - [ ] `.env` not committed to repo
  - [ ] Secrets only in Supabase secrets
- [ ] Run `npm audit` (no high/critical vulnerabilities)

## Automated Testing (Optional but Recommended)

### Unit Tests (Vitest)
```bash
npm run test
```
- [ ] Auth hook functions
- [ ] Validation schemas
- [ ] Utility functions
- [ ] Custom hooks

### E2E Tests (Playwright/Cypress)
```bash
npm run test:e2e
```
- [ ] Full signup flow
- [ ] Full signin flow
- [ ] Search functionality
- [ ] Dark mode toggle
- [ ] Navigation

### Visual Regression (Chromatic/Percy)
- [ ] Compare screenshots before/after changes
- [ ] Detect unintended visual changes

## Performance Benchmarks

```bash
# Lighthouse CI
npm run lighthouse

# Bundle analyzer
npm run build -- --analyze

# Check vulnerabilities
npm audit
```

## Test Data

### Test User Accounts
Create these accounts for testing:

```
Student Account:
Email: student@test.ovaboe.dev
Password: TestStudent123!
Role: student

Professional Account:
Email: pro@test.ovaboe.dev
Password: TestProfessional123!
Role: professional

Regular User:
Email: user@test.ovaboe.dev
Password: TestUser123!
Role: user

Admin (create manually in DB):
Email: admin@test.ovaboe.dev
Password: AdminTest123!
Role: admin
```

### Test Content
- Create test blog posts (published and draft)
- Create test courses
- Create test community posts
- Test with different data lengths (short, medium, long)

## Debugging Tips

### Console Errors
1. Open DevTools (F12)
2. Check Console tab
3. Look for:
   - Red errors (fix immediately)
   - Yellow warnings (fix if possible)
   - Network errors (check API calls)

### Email Not Sending
1. Check Resend API key in Supabase secrets
2. Verify domain in Resend dashboard
3. Check edge function logs:
   ```
   Supabase Dashboard → Edge Functions → send-auth-email → Logs
   ```
4. Verify webhook URL in Supabase Auth settings
5. Test email send manually via Resend API

### Authentication Issues
1. Clear browser cache and cookies
2. Check Supabase Auth logs
3. Verify RLS policies:
   ```sql
   SELECT * FROM user_roles WHERE user_id = 'your-user-id';
   ```
4. Test in incognito mode
5. Check network tab for 401/403 errors

### Search Not Working
1. Check Supabase RLS policies allow reading
2. Verify debounce is working (300ms delay)
3. Check network tab for search requests
4. Verify results query is correct
5. Test with different search terms

### Dark Mode Issues
1. Check localStorage for theme preference
2. Verify ThemeProvider wraps app
3. Check CSS variables in DevTools
4. Test class toggle on `<html>` element
5. Clear localStorage and retry

### Animation Performance
1. Use Chrome DevTools Performance tab
2. Record interaction
3. Look for jank (missed frames)
4. Check for unnecessary re-renders
5. Verify `will-change` CSS property used
6. Test on lower-end devices

## Reporting Bugs

When reporting bugs, include:

1. **Steps to reproduce**:
   ```
   1. Navigate to /auth
   2. Click "Sign Up"
   3. Fill in form
   4. Click submit
   5. Error appears
   ```

2. **Expected behavior**: "Should redirect to home page"

3. **Actual behavior**: "Shows error: 'Invalid credentials'"

4. **Environment**:
   - Browser: Chrome 120
   - OS: macOS Sonoma
   - Device: Desktop

5. **Screenshots/Videos**: Attach if possible

6. **Console errors**: Copy-paste error messages

7. **Network errors**: Screenshot of Network tab

## Regression Testing

After any code changes:
- [ ] Re-run full authentication flow
- [ ] Test email delivery
- [ ] Verify dark mode still works
- [ ] Check search functionality
- [ ] Test animations
- [ ] Run Lighthouse audit
- [ ] Check console for new errors

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console errors/warnings
- [ ] Lighthouse score > 90
- [ ] Email delivery working
- [ ] Dark mode working
- [ ] Search working
- [ ] Animations smooth
- [ ] Mobile responsive
- [ ] Accessibility checked
- [ ] Security tested
- [ ] Performance optimized
- [ ] SEO tags present
- [ ] `.env` variables set
- [ ] Database migrations applied
- [ ] Edge functions deployed
- [ ] Resend domain verified

## Post-Deployment Testing

After deploying to production:
- [ ] Signup with real email
- [ ] Receive verification email
- [ ] Sign in successfully
- [ ] Test all main features
- [ ] Check analytics (if enabled)
- [ ] Monitor error rates
- [ ] Check email delivery rates
- [ ] Verify SSL certificate
- [ ] Test from different locations/IPs

## Monitoring & Alerting

Setup (recommended for production):
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Analytics (Google Analytics, Plausible)
- [ ] Performance monitoring (Vercel Analytics)
- [ ] Email delivery monitoring (Resend dashboard)
- [ ] Database monitoring (Supabase dashboard)

## Known Issues & Workarounds

Document any known issues here:

1. **Issue**: Email delivery delayed in some email providers
   **Workaround**: Wait up to 5 minutes, check spam folder

2. **Issue**: Dark mode flickers on initial load
   **Workaround**: Theme initialization improved in v2.0

_(Add more as discovered)_

---

## Testing Resources

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Can I Use](https://caniuse.com/)
- [WebPageTest](https://www.webpagetest.org/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)
