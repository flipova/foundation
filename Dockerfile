# Multi-stage Dockerfile for Flipova Foundation & Studio
# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY tsup.config.ts ./

# Copy foundation source
COPY foundation/ ./foundation/

# Copy studio source
COPY studio/ ./studio/

# Install dependencies
RUN npm ci

# Build foundation and studio
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/studio/app/dist ./studio/app/dist
COPY --from=builder /app/studio/server ./studio/server
COPY --from=builder /app/studio/engine ./studio/engine
COPY --from=builder /app/studio/cli ./studio/cli

# Install production dependencies only
RUN npm ci --production

# Create directories for persistence
RUN mkdir -p /app/.flipova-studio /app/generated

# Expose the studio server port
EXPOSE 4200

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4200/api/registry', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Run the studio server
CMD ["node", "dist/studio/cli/index.js"]
