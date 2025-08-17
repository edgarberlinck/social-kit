FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json for the root project
COPY package*.json ./

# Copy package.json and package-lock.json for the backend app
COPY apps/backend/package*.json ./apps/backend/

# Copy package.json and package-lock.json for the shared database package
COPY packages/shared/database/package*.json ./packages/shared/database/

# Install root dependencies (this will also install shared/database dependencies if linked)
RUN npm install

# Copy the entire backend application
COPY apps/backend/ ./apps/backend/

# Copy the shared database package
COPY packages/shared/database/ ./packages/shared/database/

# Build the shared database package
RUN npm run build --workspace packages/shared/database

# Build the backend application
RUN npm run build --workspace apps/backend

# Set working directory to the backend app
WORKDIR /usr/src/app/apps/backend

CMD ["node", "dist/main"]