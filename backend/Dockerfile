# Multi-stage Dockerfile for What Do ATX Backend API
# Stage 1: Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies (including dev dependencies for potential build steps)
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Production stage
FROM node:18-alpine AS production

# Install security updates and create non-root user
RUN apk --no-cache add dumb-init && \
    addgroup -g 1001 -S nodejs && \
    adduser -S backend -u 1001

# Set working directory
WORKDIR /app

# Copy node_modules from builder stage
COPY --from=builder --chown=backend:nodejs /app/node_modules ./node_modules

# Copy application source code
COPY --chown=backend:nodejs . .

# Create logs directory for Winston
RUN mkdir -p logs && chown backend:nodejs logs

# Expose port (Render uses PORT environment variable)
EXPOSE 10000

# Set environment variables
ENV NODE_ENV=production \
    PORT=10000 \
    LOG_LEVEL=info

# Switch to non-root user for security
USER backend

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 10000) + '/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => { process.exit(1) })"

# Use dumb-init to handle signals properly in containers
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "start"] 