# Deployment Guide for ovaboe.dev

## 📋 Prerequisites

Before deploying, ensure you have:

1. ✅ A Supabase project set up
2. ✅ Resend API key configured
3. ✅ All tests passing (see TESTING-CHECKLIST.md)
4. ✅ No console errors or warnings
5. ✅ Environment variables ready

---

## 🔧 Environment Setup

### Required Environment Variables

```bash
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id

# These are already configured in your Supabase Edge Functions
RESEND_API_KEY=your_resend_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
AUTH_EMAIL_HOOK_SECRET=your_webhook_secret
```

---

## 📧 Email Configuration

### 1. Resend Setup

1. Go to [resend.com](https://resend.com) and log in
2. Navigate to Domains and add your domain
3. Verify domain ownership with DNS records:
   - Add TXT record for verification
   - Add SPF record: `v=spf1 include:_spf.resend.com ~all`
   - Add DKIM records provided by Resend
   - Add DMARC record: `v=DMARC1; p=none; rua=mailto:dmarc@ovaboe.dev`
4. Wait for DNS propagation (can take up to 48 hours)
5. Update `from` address in `supabase/functions/send-auth-email/index.ts`:
   ```typescript
   from: 'ovaboe.dev <noreply@ovaboe.dev>'
   ```

### 2. Supabase Auth Email Hook

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Scroll to "Send Email Hook" section
3. Enable the hook
4. Set the endpoint:
   ```
   https://giasxieqdyyqvsmtibfr.supabase.co/functions/v1/send-auth-email
   ```
5. Add the hook secret (same as AUTH_EMAIL_HOOK_SECRET)
6. Save changes

### 3. Auth Redirect URLs

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set Site URL to your production URL:
   ```
   https://ovaboe.dev
   ```
3. Add Redirect URLs:
   ```
   https://ovaboe.dev
   https://ovaboe.dev/**
   https://your-preview-url.lovableproject.com
   https://your-preview-url.lovableproject.com/**
   ```
4. Save changes

---

## 🚀 Deployment Steps

### Option 1: Deploy on Vercel (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set Environment Variables in Vercel Dashboard**:
   - Go to Project Settings → Environment Variables
   - Add all required variables
   - Redeploy to apply changes

5. **Custom Domain Setup**:
   - Go to Project Settings → Domains
   - Add `ovaboe.dev`
   - Follow DNS configuration instructions
   - Wait for SSL certificate generation

### Option 2: Deploy on Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

4. **Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add all required variables

5. **Custom Domain**:
   - Go to Domain Settings
   - Add custom domain
   - Configure DNS

### Option 3: Generic Node.js Hosting

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload `dist` folder** to your hosting provider

3. **Configure web server** (nginx example):
   ```nginx
   server {
       listen 80;
       server_name ovaboe.dev;

       root /var/www/ovaboe.dev/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;

       # SSL configuration (use Let's Encrypt)
       listen 443 ssl;
       ssl_certificate /etc/letsencrypt/live/ovaboe.dev/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/ovaboe.dev/privkey.pem;
   }
   ```

4. **Set up SSL** with Let's Encrypt:
   ```bash
   sudo certbot --nginx -d ovaboe.dev
   ```

---

## ✅ Post-Deployment Checklist

### Immediate Verification

- [ ] Site loads at production URL
- [ ] SSL certificate is valid
- [ ] Sign up flow works
- [ ] Verification email is received
- [ ] Email comes from correct domain (not spam)
- [ ] Sign in works
- [ ] Dark mode toggle works
- [ ] Search functionality works
- [ ] All pages load correctly
- [ ] No console errors

### DNS Configuration

- [ ] A record points to hosting provider
- [ ] CNAME for www (if using)
- [ ] SPF record for email
- [ ] DKIM records for email
- [ ] DMARC record for email
- [ ] DNS propagation complete

### Security

- [ ] Force HTTPS redirect
- [ ] HSTS header enabled
- [ ] CSP headers configured
- [ ] XSS protection headers
- [ ] No sensitive data in client code
- [ ] API keys are in environment variables only

### Performance

- [ ] Lighthouse score > 90
- [ ] Page load time < 3s
- [ ] Images are optimized
- [ ] Assets are cached properly
- [ ] Gzip/Brotli compression enabled

### Monitoring

- [ ] Set up error tracking (Sentry, etc.)
- [ ] Set up analytics (if applicable)
- [ ] Set up uptime monitoring
- [ ] Set up performance monitoring
- [ ] Configure backup strategy for database

---

## 🐛 Common Issues & Solutions

### Email Not Sending

**Problem**: Users not receiving verification emails

**Solutions**:
1. Check Resend API key is correct
2. Verify domain in Resend dashboard
3. Check DNS records (SPF, DKIM, DMARC)
4. Check email isn't in spam folder
5. Verify Auth Email Hook is enabled in Supabase
6. Check Edge Function logs for errors

### Auth Redirect Errors

**Problem**: "requested path is invalid" error

**Solutions**:
1. Add production URL to Supabase redirect URLs
2. Check Site URL is set correctly
3. Ensure emailRedirectTo uses correct domain
4. Clear browser cache and cookies

### Dark Mode Not Persisting

**Problem**: Theme resets on page reload

**Solutions**:
1. Check ThemeProvider is wrapping the app
2. Verify localStorage is accessible
3. Check browser doesn't block localStorage
4. Verify storage key is consistent

### Smooth Scrolling Not Working

**Problem**: Lenis not initializing

**Solutions**:
1. Check Lenis is imported correctly
2. Verify hook is called in route component
3. Check for CSS conflicts (overflow: hidden)
4. Test in different browsers

---

## 📞 Support

For issues during deployment:

1. Check [TESTING-CHECKLIST.md](./TESTING-CHECKLIST.md)
2. Review Supabase Edge Function logs
3. Check browser console for errors
4. Review network tab for failed requests
5. Contact support: support@ovaboe.dev

---

## 🎉 Success!

Once all checklist items are complete, your app is production-ready!

Remember to:
- Monitor error rates
- Check email delivery rates
- Track user signups
- Gather user feedback
- Plan regular updates and improvements
