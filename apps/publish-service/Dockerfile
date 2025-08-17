FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json for the root project
COPY package*.json ./

# Copy package.json and package-lock.json for the publish-service app
COPY apps/publish-service/package*.json ./apps/publish-service/

# Copy package.json and package-lock.json for the shared database package
COPY packages/shared/database/package*.json ./packages/shared/database/

# Install root dependencies (this will also install shared/database dependencies if linked)
RUN npm install

# Copy the entire publish-service application
COPY apps/publish-service/ ./apps/publish-service/

# Copy the shared database package
COPY packages/shared/database/ ./packages/shared/database/

# Build the shared database package
RUN npm run build --workspace packages/shared/database

# Build the publish-service application
RUN npm run build --workspace apps/publish-service

# Set working directory to the publish-service app
WORKDIR /usr/src/app/apps/publish-service

CMD ["node", "dist/main"]