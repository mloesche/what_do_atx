# 🚀 Deployment Setup Quickstart

**Fix CI/CD deployment failures by setting up required services and secrets.**

## ⚠️ Current Issues

The GitHub Actions deployment is failing because:
1. **Render services don't exist yet** 
2. **GitHub repository secrets are missing**
3. **Environment variables need configuration**

## 🔧 Quick Fix Steps

### Step 1: Create Render Services

**1.1 Create Database Service**
```bash
# Go to: https://dashboard.render.com
# Click: New → PostgreSQL
# Settings:
Name: what-do-atx-db
Database: what_do_atx  
User: what_do_atx_user
Region: Oregon (US West)
Plan: Free Tier
```

**1.2 Create Backend Web Service**
```bash
# Click: New → Web Service
# Connect: GitHub repository (mloesche/what_do_atx)
# Settings:
Name: what-do-atx-api
Branch: main
Root Directory: backend
Runtime: Docker
Build Command: (auto-detected from Dockerfile)
Start Command: (auto-detected from Dockerfile)
Plan: Free Tier
```

**1.3 Enable Database Extensions**
```sql
-- After database is created, go to Shell tab and run:
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS vector;
```

### Step 2: Configure GitHub Repository Secrets

**Go to:** `GitHub.com → your-repo → Settings → Secrets and variables → Actions`

**Add these Repository Secrets:**

```bash
# Render Configuration
RENDER_SERVICE_ID=srv-xxxxxxxxxxxxxx  # From Render service URL
RENDER_API_KEY=rnd_xxxxxxxxxxxxxx     # From Render Account Settings

# Vercel Configuration (if using Vercel)
VERCEL_TOKEN=xxxxxxxxxxxxxx          # From Vercel Account Settings
VERCEL_ORG_ID=team_xxxxxxxxxxxxxx    # From Vercel Project Settings  
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxxx # From Vercel Project Settings

# Deployment URLs (after services are created)
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://what-do-atx-api.onrender.com
```

### Step 3: Set Render Environment Variables

**In Render Dashboard → what-do-atx-api → Environment:**

```bash
# Database (auto-populated from database service)
DATABASE_URL=[automatically set by Render]

# Application
NODE_ENV=production
PORT=10000
LOG_LEVEL=info
JWT_SECRET=[generate with: openssl rand -base64 32]

# CORS
CORS_ORIGIN=https://your-actual-vercel-app.vercel.app
ALLOWED_ORIGINS=https://your-actual-vercel-app.vercel.app

# API Keys (add when ready to enable features)
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxx
GOOGLE_OAUTH_CLIENT_ID=xxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_OAUTH_CLIENT_SECRET=xxxxxxxxxxxxxx
EVENTBRITE_API_KEY=xxxxxxxxxxxxxx
```

### Step 4: Test Deployment

**4.1 Push to trigger deployment:**
```bash
git add .
git commit -m "fix: Configure deployment secrets and services"
git push origin main
```

**4.2 Monitor deployment:**
- **GitHub Actions:** Check workflow in Actions tab
- **Render:** Monitor deployment in Render dashboard
- **Vercel:** Check deployment in Vercel dashboard

## 🔍 Troubleshooting

### Common Issues

**❌ "Service not found"**
```bash
# Fix: Ensure RENDER_SERVICE_ID matches the actual service ID
# Get from: Render dashboard → Service → Settings → Service ID
```

**❌ "API key invalid"**  
```bash
# Fix: Generate new API key
# Go to: Render Account Settings → API Keys → Create New Key
```

**❌ "Database connection failed"**
```bash
# Fix: Ensure database is running and extensions are installed
# Check: Render dashboard → Database → Events tab for errors
```

**❌ "Build failed"**
```bash
# Fix: Check Dockerfile syntax and dependencies
# Verify: Docker build works locally with:
cd backend && docker build -t test .
```

### Health Check URLs

After successful deployment, these should work:
- **Backend Health:** `https://what-do-atx-api.onrender.com/health`
- **Frontend:** `https://your-app.vercel.app/`

## 📚 Next Steps

1. **Configure API Keys:** Add OpenAI, Google OAuth, Eventbrite keys when ready
2. **Custom Domain:** Set up custom domains in Render/Vercel dashboards  
3. **Monitoring:** Set up alerts and monitoring
4. **SSL:** Verify HTTPS is working correctly

## 🆘 Still Having Issues?

- **Check logs:** Render dashboard → Service → Logs
- **View builds:** GitHub Actions → Workflow runs
- **Review docs:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for comprehensive setup
- **Rollback:** Use [ROLLBACK_PROCEDURES.md](ROLLBACK_PROCEDURES.md) if needed

---

**⏱️ Time to complete:** ~15-20 minutes for basic setup 