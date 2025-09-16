🔑 Where to get these environment variables?

GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET

Go to the Google Cloud Console
.

Create or select a project.

Enable Google Identity Services → OAuth 2.0 Client IDs.

Configure OAuth consent screen (set scopes like email and profile).

Create OAuth credentials with:

Application type = Web application

Authorized redirect URIs:

http://localhost:3000/api/auth/callback/google


(and in production: https://yourdomain.com/api/auth/callback/google)

Copy:

Client ID → GOOGLE_CLIENT_ID

Client Secret → GOOGLE_CLIENT_SECRET








NEXTAUTH_SECRET

Just a random string for signing/validating tokens.

You can generate one with:

openssl rand -base64 32


Or use a service like https://generate-secret.vercel.app/32
.

NEXTAUTH_URL

The base URL of your app.

In dev: http://localhost:3000

In production: https://yourdomain.com