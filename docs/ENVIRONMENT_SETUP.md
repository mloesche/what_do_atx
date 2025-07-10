# Environment Variables Setup Guide

## Overview

This guide covers setting up environment variables for the **What Do ATX** project across different environments:
- Local development
- Vercel (frontend hosting)
- Render (backend services & database)

## 🚀 Quick Start for Local Development

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** with your actual values (start with the pre-filled development values)

3. **Verify Next.js picks up the variables:**
   ```bash
   npm run dev
   ```

## 📁 Environment Files Structure

```
├── .env.example          # Template with all possible variables
├── .env.local            # Local development (not committed)
├── .env.production       # Production overrides (optional)
└── docs/ENVIRONMENT_SETUP.md
```

## 🔧 Local Development Setup

### Required for Basic Functionality

```bash
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret-here"
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Generate Secure Secrets

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate NextAuth secret  
openssl rand -base64 32

# Generate session secret
openssl rand -base64 32
```

## ☁️ Vercel Environment Setup

### 1. Access Vercel Dashboard
- Go to [vercel.com](https://vercel.com)
- Navigate to your project
- Go to **Settings** > **Environment Variables**

### 2. Add Frontend Environment Variables

**Essential Variables:**
```
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_API_URL=https://your-render-api.onrender.com
```

**Google OAuth (when ready):**
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**AI Services (when ready):**
```
OPENAI_API_KEY=sk-proj-your-key
OPENAI_ORG_ID=your-org-id
```

### 3. Environment-Specific Settings

Set variables for specific environments:
- **Development**: For preview deployments
- **Preview**: For pull request previews  
- **Production**: For main branch deployments

## 🚀 Render Environment Setup

### 1. Database Setup (Render Postgres)

1. **Create Postgres Database:**
   - Go to Render dashboard
   - Click **New** > **PostgreSQL**
   - Choose plan and region
   - Note the connection details

2. **Enable Extensions:**
   ```sql
   -- Connect to your database and run:
   CREATE EXTENSION IF NOT EXISTS postgis;
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

3. **Get Database URL:**
   - Copy the **External Database URL** from Render
   - Format: `postgresql://user:pass@host:port/dbname`

### 2. Backend Services Setup

For each backend service (API, scraper, etc.):

1. **Create Web Service:**
   - Go to Render dashboard
   - Click **New** > **Web Service**
   - Connect your repository
   - Choose backend directory if applicable

2. **Add Environment Variables:**

**Database Connection:**
```
DATABASE_URL=postgresql://user:pass@host:port/dbname
POSTGRES_HOST=your-render-postgres-host
POSTGRES_PORT=5432
POSTGRES_DB=what_do_atx
POSTGRES_USER=your-user
POSTGRES_PASSWORD=your-password
```

**API Keys:**
```
OPENAI_API_KEY=sk-proj-your-key
EVENTBRITE_API_KEY=your-eventbrite-key
GOOGLE_CALENDAR_API_KEY=your-google-key
```

**Security:**
```
JWT_SECRET=your-jwt-secret
SESSION_SECRET=your-session-secret
```

**Service Communication:**
```
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### 3. Redis Cache (Optional)

1. **Create Redis Instance:**
   - Click **New** > **Redis**
   - Choose plan and region

2. **Add Redis URL:**
   ```
   REDIS_URL=redis://user:pass@host:port
   REDIS_TTL=3600
   ```

## 🔐 Security Best Practices

### 1. Secret Management

- **Never commit secrets** to version control
- **Use strong, unique secrets** for each environment
- **Rotate secrets regularly** in production
- **Use environment-specific secrets** (don't reuse dev secrets in prod)

### 2. Access Control

- **Limit environment variable access** to necessary team members
- **Use Vercel teams** for collaboration
- **Monitor access logs** in production

### 3. Validation

```typescript
// Example environment validation (for Next.js)
const requiredEnvVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'JWT_SECRET'
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

## 🐛 Troubleshooting

### Common Issues

1. **Environment variables not loading:**
   - Restart development server
   - Check file name (`.env.local` not `.env.local.txt`)
   - Verify no spaces around `=`

2. **Vercel deployment fails:**
   - Check environment variable names match exactly
   - Ensure all required variables are set
   - Check build logs for specific errors

3. **Render service can't connect:**
   - Verify database URL format
   - Check network restrictions
   - Confirm environment variables in service settings

### Debugging Commands

```bash
# Check loaded environment variables (be careful with sensitive data)
npm run dev -- --inspect-env

# Test database connection
node -e "console.log(process.env.DATABASE_URL)"

# Verify Next.js environment
npx next info
```

## 📚 Reference

### Environment Variable Naming

- **Public variables**: `NEXT_PUBLIC_*` (exposed to browser)
- **Server-only variables**: No prefix (server-side only)
- **Development**: Include meaningful defaults in `.env.local`
- **Production**: Always use secure, generated secrets

### Integration Timeline

1. **Phase 1**: Basic Next.js app (current)
2. **Phase 2**: Database and authentication
3. **Phase 3**: External APIs (Google, OpenAI)
4. **Phase 4**: Event sources (Eventbrite, Do512)
5. **Phase 5**: Monitoring and caching

## 🆘 Need Help?

- Check the [Vercel Environment Variables docs](https://vercel.com/docs/concepts/projects/environment-variables)
- Check the [Render Environment Variables docs](https://render.com/docs/environment-variables)
- Review the `.env.example` file for all available variables
- Ensure secrets are properly generated and unique per environment 