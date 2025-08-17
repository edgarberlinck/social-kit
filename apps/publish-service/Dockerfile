# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app/

# Copy root package.json and lockfile
COPY package*.json ./

# Copy all source code
COPY . .

# Install dependencies (root + all workspaces)
RUN npm ci

# Build all workspaces
RUN npm run build --workspaces

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy root package.json
COPY --from=builder /app/package*.json ./

# Copy publish-service app
COPY --from=builder /app/apps/publish-service ./apps/publish-service

# Copy built shared package
COPY --from=builder /app/packages/shared/database/dist ./packages/shared/database/dist

# Install only production dependencies of publish-service
RUN npm ci --workspace apps/publish-service --omit=dev

WORKDIR /app/apps/publish-service

CMD ["node", "dist/main"]