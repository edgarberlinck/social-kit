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

# Copy backoffice-backend app
COPY --from=builder /app/apps/backoffice-backend ./apps/backoffice-backend

# Copy built shared package
COPY --from=builder /app/packages/shared/database/dist ./packages/shared/database/dist

# Install only production dependencies of backoffice-backend
RUN npm ci --workspace apps/backoffice-backend --omit=dev

WORKDIR /app/apps/backoffice-backend

CMD ["node", "dist/main"]
