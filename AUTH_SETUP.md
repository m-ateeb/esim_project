# Authentication Setup Guide

This guide will help you set up OAuth authentication with Google and email/password authentication for your eSIM website.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/esim_db"
DIRECT_URL="postgresql://username:password@localhost:5432/esim_db"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Vercel environment variables

In Vercel, set these in Project Settings → Environment Variables (for Production/Preview/Development as needed):

```env
NEXTAUTH_SECRET=your-strong-random-secret
NEXTAUTH_URL=https://your-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
DATABASE_URL=your-production-database-url
DIRECT_URL=your-production-direct-url
```

Notes:
- `NEXTAUTH_URL` must match your production domain exactly (use HTTPS).
- We enable `trustHost` in NextAuth options to work behind Vercel's proxy.
- For Preview deployments, you can omit `NEXTAUTH_URL` and rely on `trustHost`, or set it via Vercel Environment Variables for each environment.

## Google OAuth Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create a new OAuth 2.0 Client ID
5. Set the authorized redirect URI to: `http://localhost:3000/api/auth/callback/google`
6. Copy the Client ID and Client Secret to your `.env.local` file

### Google OAuth in Production (Vercel)

Add the following Authorized redirect URIs in your Google Cloud OAuth client:

- `https://your-domain.com/api/auth/callback/google` (Production)
- Optionally, your Vercel preview domain: `https://your-project-name.vercel.app/api/auth/callback/google`

Also add Authorized JavaScript origins:

- `https://your-domain.com`
- `https://your-project-name.vercel.app` (if using preview)

After deploying to Vercel, confirm that the Sign-in URL displayed by NextAuth matches your domain and that cookies are set on your domain.

## Database Setup

1. Make sure your PostgreSQL database is running
2. Run the Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
3. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

## Features Implemented

### Authentication Methods
- **Email/Password**: Traditional registration and login
- **Google OAuth**: One-click sign-in with Google account

### Security Features
- Password hashing with bcryptjs
- JWT session management
- Protected routes with middleware
- Form validation and error handling

### User Experience
- Toast notifications for success/error states
- Loading states during authentication
- Automatic redirect after successful login
- User profile dropdown with logout functionality

### Components Created
- `useAuth` hook for authentication state management
- `UserProfile` component for user menu
- `AuthProvider` for NextAuth session management
- `ToasterProvider` for notifications
- Protected middleware for secure routes

## Usage

### Login Page (`/login`)
- Email/password authentication
- Google OAuth sign-in
- Form validation and error handling
- Redirect to dashboard on success

### Register Page (`/register`)
- User registration with email/password
- Google OAuth sign-up
- Password confirmation
- Terms of service agreement
- Auto-login after successful registration

### Dashboard (`/dashboard`)
- Protected route requiring authentication
- Displays user information
- User profile dropdown with logout
- Personalized welcome message

### API Routes
- `/api/auth/[...nextauth]` - NextAuth.js authentication endpoints
- `/api/auth/register` - User registration endpoint

## Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the registration flow:
   - Go to `/register`
   - Create a new account with email/password
   - Verify you're redirected to the dashboard

3. Test the login flow:
   - Go to `/login`
   - Sign in with your credentials
   - Verify you're redirected to the dashboard

4. Test Google OAuth:
   - Click "Continue with Google" on login/register pages
   - Complete Google authentication
   - Verify you're redirected to the dashboard

5. Test protected routes:
   - Try accessing `/dashboard` without authentication
   - Verify you're redirected to login

6. Test logout:
   - Click the user profile dropdown
   - Click "Sign out"
   - Verify you're redirected to the home page

## Troubleshooting

### Common Issues

1. **"Invalid credentials" error**
   - Check that your Google OAuth credentials are correct
   - Verify the redirect URI matches exactly

2. **OAuth callback timeout**
   - We increased the Google provider HTTP timeout to 10s. If timeouts persist, verify network egress and DNS from your environment, and ensure `accounts.google.com` is reachable.
   - Confirm `NEXTAUTH_URL` is set correctly for the current environment.

2. **Database connection errors**
   - Ensure PostgreSQL is running
   - Check your DATABASE_URL format
   - Run `npx prisma db push` to sync schema

3. **NextAuth secret errors**
   - Generate a new secret: `openssl rand -base64 32`
   - Update your NEXTAUTH_SECRET environment variable

4. **CORS errors**
   - Ensure NEXTAUTH_URL matches your development URL
   - Add your domain to Google OAuth authorized origins

### Development Tips

- Use the browser's developer tools to check for console errors
- Check the Network tab for failed API requests
- Use the Application tab to inspect session storage
- Enable NextAuth debug mode by setting `NODE_ENV=development`

## Security Considerations

- Always use HTTPS in production
- Regularly rotate your NEXTAUTH_SECRET
- Implement rate limiting for auth endpoints
- Add email verification for new accounts
- Consider implementing 2FA for additional security
- Monitor authentication logs for suspicious activity
