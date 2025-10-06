# Testing Documentation

## Overview

This document provides comprehensive testing guidelines for the application, covering manual testing procedures, automated testing setup recommendations, and quality assurance best practices.

## Current Testing Status

✅ **Manual Testing**: Active and documented
⚠️ **Automated Testing**: Not yet implemented (recommended for production)

## Manual Testing Procedures

### 1. Authentication Testing

#### Sign Up Flow
```
Test Case: New User Registration
Steps:
1. Navigate to /auth
2. Click "Sign Up" tab
3. Enter valid full name (e.g., "John Doe")
4. Enter valid email (e.g., "john@example.com")
5. Enter valid password (meets requirements)
6. Click "Sign Up"

Expected Results:
✅ Success toast appears
✅ Email confirmation sent
✅ No error messages
✅ Form clears after submission

Test Variations:
- Invalid email format → Show validation error
- Weak password → Show password requirements
- Duplicate email → Show "User already exists" error
- Empty fields → Show required field errors
```

#### Sign In Flow
```
Test Case: Existing User Login
Steps:
1. Navigate to /auth
2. Enter registered email
3. Enter correct password
4. Click "Sign In"

Expected Results:
✅ Welcome toast appears
✅ Redirect to home page
✅ User session established
✅ Protected routes accessible

Test Variations:
- Wrong password → Show "Invalid credentials"
- Unverified email → Show verification required
- Non-existent email → Show "Invalid credentials"
```

#### Sign Out
```
Test Case: User Logout
Steps:
1. While authenticated, click "Sign Out" in navbar/sidebar
2. Confirm sign out

Expected Results:
✅ Session cleared
✅ Redirect to public page
✅ Protected routes inaccessible
✅ Sign out toast appears
```

### 2. Authorization Testing

#### Role-Based Access
```
Test Case: Admin Role Permissions
Prerequisites: User with admin role

Steps:
1. Sign in as admin
2. Navigate to blog post (not authored by admin)
3. Attempt to edit blog post
4. Attempt to delete blog post

Expected Results:
✅ Edit button visible and functional
✅ Delete button visible and functional
✅ Changes save successfully

Test Variations:
- Regular user → Cannot edit others' posts
- Moderator → Limited moderation access
```

#### Profile Privacy
```
Test Case: Private Profile Access
Prerequisites: User A with private profile, User B logged in

Steps:
1. User B attempts to view User A's profile
2. Check what data is visible

Expected Results:
✅ Email not visible
✅ Phone not visible
✅ Public fields visible (username, bio, avatar)

Test Variations:
- Public profile → All allowed fields visible
- Own profile → All fields visible including email
```

### 3. Search Functionality Testing

#### Global Search
```
Test Case: Search Across Content Types
Steps:
1. Click search button or press Cmd/Ctrl + K
2. Type search query (e.g., "javascript")
3. Wait for results (debounced)
4. Click on a result

Expected Results:
✅ Search modal opens
✅ Results appear after typing
✅ Shows blogs, courses, and community posts
✅ Clicking result navigates correctly
✅ ESC key closes modal

Test Variations:
- Empty query → No results shown
- No matches → "No results" message
- Special characters → Properly escaped
- Very long query → Handled gracefully
```

### 4. Input Validation Testing

#### Blog Creation
```
Test Case: Blog Form Validation
Steps:
1. Navigate to /thinkspace/write
2. Try submitting with empty title
3. Try submitting with very long title (>200 chars)
4. Try submitting with empty content
5. Try submitting with valid data

Expected Results:
✅ Empty title → Validation error
✅ Long title → Character limit error
✅ Empty content → Validation error
✅ Valid data → Blog created successfully

Test Variations:
- XSS attempt in title → Sanitized
- SQL injection attempt → Prevented
- Excessive tags → Limited to 10
```

#### Profile Update
```
Test Case: Profile Edit Validation
Steps:
1. Navigate to /profile
2. Click edit
3. Try invalid phone format
4. Try username < 3 characters
5. Try bio > 500 characters
6. Submit with valid data

Expected Results:
✅ Invalid phone → Format error
✅ Short username → Length error
✅ Long bio → Character limit error
✅ Valid data → Profile updated
```

### 5. Security Testing

#### Protected Routes
```
Test Case: Unauthorized Access Prevention
Steps:
1. Sign out if authenticated
2. Manually navigate to /profile
3. Manually navigate to /skillspace
4. Manually navigate to /settings

Expected Results:
✅ Redirect to /auth
✅ No data exposure
✅ Login required message
```

#### RLS Policy Enforcement
```
Test Case: Database Access Control
Prerequisites: Access to Supabase SQL Editor

Steps:
1. Execute: SELECT * FROM profiles;
2. Execute: SELECT * FROM user_roles;
3. Execute: UPDATE profiles SET email = 'hack@test.com' WHERE user_id != auth.uid();

Expected Results:
✅ Can only see own profile data
✅ Can only see own roles
✅ Cannot update other users' data
❌ Unauthorized updates rejected
```

#### Audit Logging
```
Test Case: Security Event Tracking
Prerequisites: Admin access to audit_logs table

Steps:
1. Perform sensitive operation (e.g., role change)
2. Check audit_logs table

Expected Results:
✅ Event logged with correct action
✅ User ID captured
✅ Timestamp accurate
✅ Old/new data recorded
```

### 6. UI/UX Testing

#### Responsive Design
```
Test Case: Mobile Responsiveness
Devices to Test: Mobile (375px), Tablet (768px), Desktop (1920px)

Steps:
1. Navigate through all pages
2. Test navigation menu
3. Test forms
4. Test search
5. Test modals/dialogs

Expected Results:
✅ All content readable
✅ No horizontal scroll
✅ Touch targets adequate (44px minimum)
✅ Forms usable
✅ Modals properly sized
```

#### Dark/Light Mode
```
Test Case: Theme Switching
Steps:
1. Click theme toggle in sidebar
2. Navigate through pages
3. Check all components

Expected Results:
✅ Theme switches smoothly
✅ All text readable in both modes
✅ Proper contrast ratios
✅ Images/icons visible
✅ Preference persists on refresh
```

### 7. Performance Testing

#### Page Load Times
```
Test Case: Initial Load Performance
Steps:
1. Open Chrome DevTools (Network tab)
2. Navigate to application
3. Measure load times

Expected Results:
✅ First Contentful Paint < 1.5s
✅ Time to Interactive < 3.5s
✅ Largest Contentful Paint < 2.5s

Tools: Lighthouse, WebPageTest
```

#### Search Performance
```
Test Case: Search Response Time
Steps:
1. Open Network tab
2. Perform search
3. Measure time to results

Expected Results:
✅ Results appear < 500ms
✅ Debouncing works (300ms delay)
✅ No duplicate requests
```

## Recommended Automated Testing Setup

### Unit Testing with Vitest

```typescript
// Example: hooks/useAuth.test.tsx
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

describe('useAuth', () => {
  it('should sign up user successfully', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const { error } = await result.current.signUp(
        'test@example.com',
        'Password123',
        'Test User'
      );
      expect(error).toBeNull();
    });
  });

  it('should validate password requirements', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const { error } = await result.current.signUp(
        'test@example.com',
        'weak',
        'Test User'
      );
      expect(error).toBeTruthy();
    });
  });
});
```

### Integration Testing with Playwright

```typescript
// Example: tests/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should complete signup process', async ({ page }) => {
    await page.goto('/auth');
    await page.click('text=Sign Up');
    
    await page.fill('[id="signup-name"]', 'Test User');
    await page.fill('[id="signup-email"]', 'test@example.com');
    await page.fill('[id="signup-password"]', 'Password123');
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=check your email')).toBeVisible();
  });

  test('should prevent access to protected routes', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL('/auth');
  });
});
```

### Component Testing with React Testing Library

```typescript
// Example: components/search/GlobalSearch.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GlobalSearch } from '@/components/search/GlobalSearch';

describe('GlobalSearch', () => {
  it('should open on Cmd+K', () => {
    render(<GlobalSearch />);
    
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('should display search results', async () => {
    render(<GlobalSearch />);
    
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: 'javascript' } });
    
    await waitFor(() => {
      expect(screen.getByText(/blog/i)).toBeInTheDocument();
    });
  });
});
```

## Test Data Setup

### Seed Database for Testing

```sql
-- Create test users with different roles
INSERT INTO auth.users (id, email) VALUES
  ('admin-uuid', 'admin@test.com'),
  ('user-uuid', 'user@test.com');

INSERT INTO public.user_roles (user_id, role) VALUES
  ('admin-uuid', 'admin'),
  ('user-uuid', 'user');

-- Create test content
INSERT INTO public.blogs (id, title, content, author_id, published) VALUES
  (gen_random_uuid(), 'Test Blog', 'Content here', 'user-uuid', true);
```

### Mock Data Factories

```typescript
// test-utils/factories.ts
export const createMockUser = (overrides = {}) => ({
  id: 'mock-user-id',
  email: 'mock@test.com',
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockBlog = (overrides = {}) => ({
  id: 'mock-blog-id',
  title: 'Mock Blog Title',
  content: 'Mock content',
  author_id: 'mock-user-id',
  published: true,
  ...overrides,
});
```

## Continuous Testing Recommendations

### Pre-commit Checks
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:coverage": "vitest run --coverage"
  }
}
```

### CI/CD Pipeline (GitHub Actions Example)
```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run test
      - run: npm run test:e2e
```

## Quality Metrics

### Coverage Targets
- Unit Test Coverage: > 80%
- Integration Test Coverage: > 60%
- Critical Path Coverage: 100%

### Performance Budgets
- Bundle Size: < 250kb gzipped
- Time to Interactive: < 3.5s
- First Contentful Paint: < 1.5s

## Bug Reporting Template

```markdown
### Bug Report

**Title**: Brief description

**Environment**:
- Browser: Chrome 120
- OS: macOS 14
- User Role: User/Admin

**Steps to Reproduce**:
1. Go to...
2. Click on...
3. See error

**Expected Behavior**:
What should happen

**Actual Behavior**:
What actually happens

**Screenshots**:
[If applicable]

**Console Errors**:
[Paste any errors]
```

## Testing Checklist Before Deployment

- [ ] All manual test cases pass
- [ ] Authentication flows tested
- [ ] Authorization rules verified
- [ ] Search functionality works
- [ ] Forms validate correctly
- [ ] RLS policies enforced
- [ ] Mobile responsiveness checked
- [ ] Dark/light modes tested
- [ ] Performance within budgets
- [ ] No console errors
- [ ] Security audit completed
- [ ] Accessibility tested

## Accessibility Testing

### WCAG 2.1 AA Compliance
```
- Keyboard navigation works
- Screen reader compatible
- Sufficient color contrast
- Form labels present
- Alt text on images
- Focus indicators visible
```

### Tools
- axe DevTools
- WAVE Extension
- Lighthouse Accessibility Audit

---

Last Updated: 2025-10-06
