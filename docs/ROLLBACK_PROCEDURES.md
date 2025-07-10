# Rollback Procedures 🔄

Emergency rollback strategies for What Do ATX application deployments on Vercel (frontend) and Render (backend).

## 🚨 Emergency Contacts & Access

**Before You Begin:**
- Ensure you have admin access to both Vercel and Render dashboards
- Keep GitHub repository access handy for manual interventions
- Have database backup credentials ready

### Quick Access Links
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **GitHub Repository**: https://github.com/mloesche/what_do_atx
- **Status Pages**: Vercel Status, Render Status

---

## 🎯 Frontend Rollback (Vercel)

### Automatic Rollback (Recommended)

**1. Via Vercel Dashboard - Instant Rollback**
```bash
# Time to complete: ~30 seconds
1. Go to Vercel Dashboard → what_do_atx project
2. Click "Deployments" tab  
3. Find the last known working deployment
4. Click "..." → "Redeploy"
5. Confirm redeploy to production
```

**2. Via Vercel CLI - Command Line**
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login and switch to project
vercel login
vercel switch what_do_atx

# List recent deployments
vercel ls

# Promote a specific deployment to production
vercel --target production --force [deployment-url]
```

### Manual Git Rollback

**When automatic rollback fails:**

```bash
# 1. Identify the last working commit
git log --oneline -10

# 2. Create emergency rollback branch
git checkout main
git checkout -b emergency-rollback-$(date +%Y%m%d-%H%M)

# 3. Revert to last working commit (replace COMMIT_HASH)
git revert COMMIT_HASH --no-edit

# 4. Push to trigger new deployment
git push origin emergency-rollback-$(date +%Y%m%d-%H%M)

# 5. Merge to main via GitHub PR for immediate deployment
```

### Vercel-Specific Issues

**Environment Variable Problems:**
```bash
# Backup current env vars
vercel env ls > env-backup-$(date +%Y%m%d-%H%M).txt

# Pull known working env vars from another environment
vercel env pull .env.production
vercel env add VARIABLE_NAME production < value
```

**Build Failures:**
```bash
# Force redeploy with previous Node.js version
# In Vercel Dashboard → Settings → General → Node.js Version
# Set to previous working version (e.g., 18.x → 16.x)
```

---

## 🖥️ Backend Rollback (Render)

### Automatic Rollback via Render Dashboard

**1. Deployment History Rollback**
```bash
# Time to complete: ~2-3 minutes
1. Go to Render Dashboard → what_do_atx-api service
2. Click "Deploys" tab
3. Find last successful deployment (green checkmark)
4. Click "Redeploy" on that deployment
5. Monitor deployment progress and health checks
```

**2. Manual Scaling During Issues**
```bash
# Emergency: Scale down and up to restart
1. Dashboard → what_do_atx-api → Settings
2. Change instance count to 0 (stop all instances)
3. Wait 30 seconds
4. Change instance count back to 1+ (restart)
```

### Docker Image Rollback

**When current Docker image is problematic:**

```bash
# 1. In Render Dashboard → what_do_atx-api → Environment
# 2. Add environment variable for image rollback:
DOCKER_IMAGE_TAG=previous-working-sha

# 3. Or manually trigger previous commit deploy:
# Go to GitHub → what_do_atx repository
# Find last working commit in main branch
# Create new commit that reverts problematic changes
```

### Database Emergency Procedures

**Render PostgreSQL Rollback:**

```bash
# 1. Access database through Render dashboard
# Dashboard → PostgreSQL instance → Connect

# 2. For critical data corruption, restore from backup:
psql postgresql://user:pass@host/db

# 3. Check recent backup availability
# Render provides automatic backups - contact support for restore

# 4. Emergency read-only mode
# Temporarily modify app to prevent writes:
ALTER USER your_app_user SET default_transaction_read_only = on;
```

---

## 🔄 Cross-Service Rollback Scenarios

### Full Application Rollback

**When both frontend and backend need rollback:**

```bash
# 1. Start with backend rollback (most critical)
# Follow backend rollback procedures first

# 2. Rollback frontend to compatible version
# Ensure frontend version is compatible with rolled-back backend

# 3. Verify cross-service communication
curl https://your-frontend.vercel.app/api/health
curl https://your-backend.onrender.com/health
```

### Environment Variables Sync Issues

**When env vars get out of sync between services:**

```bash
# 1. Backup current state
# Export from both Vercel and Render dashboards

# 2. Restore known working configuration
# Use environment setup guide to restore consistent state

# 3. Test service communication
# Verify API URLs, authentication keys, etc.
```

---

## 🧪 Testing After Rollback

### Automated Health Checks

```bash
# Frontend health check
curl -f https://your-app.vercel.app/ || echo "Frontend DOWN"

# Backend health check  
curl -f https://your-api.onrender.com/health || echo "Backend DOWN"

# Database connectivity
curl -f https://your-api.onrender.com/api/db-health || echo "Database issues"
```

### Manual Verification Checklist

- [ ] Frontend loads without errors
- [ ] API endpoints respond correctly
- [ ] Database queries execute successfully
- [ ] Authentication flow works
- [ ] External integrations (Do512, Eventbrite) functioning
- [ ] Static assets load properly
- [ ] Environment variables are correct

---

## 📞 Emergency Escalation

### When Rollbacks Fail

**1. Service Status Issues:**
- Check Vercel status page
- Check Render status page  
- Contact platform support if needed

**2. Data Loss Concerns:**
- **DO NOT** proceed with destructive operations
- Contact database administrator
- Coordinate with team before database changes

**3. External Dependencies:**
- Verify third-party API status (OpenAI, Google, etc.)
- Check DNS resolution
- Validate CDN and static asset delivery

### Contact Information

**Platform Support:**
- **Vercel Support**: https://vercel.com/support
- **Render Support**: https://help.render.com/

**Internal Team:**
- **Primary**: [Your primary contact]
- **Database**: [Database administrator]
- **DevOps**: [DevOps team contact]

---

## 📝 Post-Rollback Actions

### Document the Incident

```bash
# 1. Create incident report
# - What went wrong?
# - What was the impact?
# - How was it resolved?
# - How can we prevent it?

# 2. Update monitoring
# - Add alerts for detected failure patterns
# - Improve health checks if needed

# 3. Review deployment process
# - Consider adding staging environment
# - Enhance testing before production
```

### Monitoring Setup

```bash
# Set up alerts for future issues:
# 1. Vercel deployment failure alerts
# 2. Render service health monitoring  
# 3. Database connection monitoring
# 4. External API dependency alerts
```

---

## 🔧 Prevention Best Practices

### Deployment Safety

- **Always test in staging** before production
- **Use feature flags** for risky changes
- **Monitor metrics** immediately after deployment
- **Keep rollback plan** updated and tested
- **Practice rollback procedures** regularly

### Database Safety

- **Backup before schema changes**
- **Use migrations** for database changes
- **Test queries** on production replica
- **Monitor query performance** after changes

---

**⚠️ Remember: When in doubt, rollback first, investigate later. Uptime is priority #1.** 