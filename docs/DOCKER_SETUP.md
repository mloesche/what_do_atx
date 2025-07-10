# Docker Development Setup

This guide covers the Docker containerization setup for the What Do ATX application, including both production deployment and local development environments.

## Overview

The application uses Docker for:
- **Production deployment** on Render with optimized containers
- **Local development** with full-stack orchestration via Docker Compose
- **CI/CD pipeline** with containerized testing and deployment

## Production Docker Setup

### Backend Dockerfile

The backend uses a multi-stage Dockerfile for optimal production deployment:

```dockerfile
# Located at: backend/Dockerfile
# Features:
- Multi-stage build for size optimization
- Non-root user for security
- Health checks for container monitoring
- Alpine Linux base for minimal attack surface
- Proper signal handling with dumb-init
```

**Key security features:**
- Runs as non-root user (`backend:1001`)
- Uses `dumb-init` for proper process management
- Health checks for monitoring
- Minimal Alpine Linux base image

### Render Deployment

The `backend/render.yaml` configuration uses Docker deployment:

```yaml
env: docker
dockerfilePath: ./Dockerfile
healthCheckPath: /health
```

**Deployment process:**
1. Render builds the Docker image from the Dockerfile
2. Container starts with health check monitoring
3. PostgreSQL database with PostGIS + pgvector extensions
4. Environment variables injected securely

## Local Development with Docker Compose

### Quick Start

```bash
# Start the entire development stack
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| `frontend` | 3000 | Next.js development server |
| `backend` | 3001 | Node.js API with hot reload |
| `database` | 5432 | PostgreSQL with pgvector |
| `redis` | 6379 | Redis for caching (future use) |

### Development Features

**Hot Reloading:**
- Frontend: Source code mounted for instant updates
- Backend: Source code mounted (requires restart for changes)

**Database:**
- PostgreSQL 15 with pgvector extension
- Auto-initialization with development data
- Persistent data volumes

**Environment:**
- Development-optimized settings
- Debug logging enabled
- CORS configured for local frontend

### Development Workflow

1. **Start services:**
   ```bash
   docker-compose up -d database redis
   docker-compose up backend frontend
   ```

2. **View application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - Health check: http://localhost:3001/health

3. **Database access:**
   ```bash
   # Connect to PostgreSQL
   docker-compose exec database psql -U what_do_atx_user -d what_do_atx_dev
   
   # Run migrations
   docker-compose exec backend npm run migrate
   ```

4. **Debugging:**
   ```bash
   # View logs
   docker-compose logs -f backend
   docker-compose logs -f frontend
   
   # Restart specific service
   docker-compose restart backend
   
   # Shell into container
   docker-compose exec backend sh
   ```

## CI/CD Integration

The GitHub Actions workflow (`.github/workflows/deploy.yml`) includes Docker integration:

### Build Process
1. **Docker Build:** Creates optimized backend image
2. **Container Testing:** Validates health endpoints
3. **Integration Testing:** Tests with PostgreSQL database
4. **Deployment:** Pushes to Render for production

### Test Environment
- Uses `pgvector/pgvector:pg15` for database
- Tests both traditional Node.js and Docker deployments
- Validates cross-service communication

## Best Practices

### Security
- **Non-root containers:** All services run as non-root users
- **Minimal images:** Alpine Linux base for reduced attack surface
- **Health checks:** Proper monitoring and restart policies
- **Secret management:** Environment variables for sensitive data

### Performance
- **Multi-stage builds:** Optimized production images
- **Layer caching:** Efficient dependency installation
- **Volume mounts:** Fast development iteration
- **Health checks:** Proper service startup sequencing

### Development
- **Hot reloading:** Immediate feedback during development
- **Service isolation:** Each component in separate container
- **Port mapping:** Consistent local development URLs
- **Log aggregation:** Centralized logging for debugging

## Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check for conflicting services
lsof -i :3000 -i :3001 -i :5432

# Use different ports if needed
docker-compose -f docker-compose.override.yml up
```

**Database connection issues:**
```bash
# Check database health
docker-compose exec database pg_isready -U what_do_atx_user

# Reset database
docker-compose down -v
docker-compose up database
```

**Container build failures:**
```bash
# Clean build cache
docker builder prune

# Rebuild without cache
docker-compose build --no-cache backend
```

### Performance Optimization

**Development:**
- Use `.dockerignore` to exclude unnecessary files
- Mount only necessary directories for hot reload
- Use multi-stage builds for production images

**Production:**
- Enable Docker BuildKit for faster builds
- Use layer caching in CI/CD
- Implement health checks for proper load balancing

## Environment Variables

### Backend Container
```env
NODE_ENV=development|production
PORT=3001|10000
LOG_LEVEL=debug|info
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

### Database Container
```env
POSTGRES_DB=what_do_atx_dev
POSTGRES_USER=what_do_atx_user
POSTGRES_PASSWORD=dev_password
```

## Next Steps

1. **Production Setup:** Follow deployment guide for Render configuration
2. **Environment Variables:** Configure secrets in Render dashboard
3. **Database Extensions:** Enable PostGIS and pgvector in production
4. **Monitoring:** Set up logging and health check alerts
5. **Scaling:** Configure auto-scaling policies for production workloads

For production deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md). 