FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json for the root project
COPY package*.json ./

# Copy package.json and package-lock.json for the backoffice-backend app
COPY apps/backoffice-backend/package*.json ./apps/backoffice-backend/

# Copy package.json and package-lock.json for the shared database package
COPY packages/shared/database/package*.json ./packages/shared/database/

# Install root dependencies (this will also install shared/database dependencies if linked)
RUN npm install

# Copy the entire backoffice-backend application
COPY apps/backoffice-backend/ ./apps/backoffice-backend/

# Copy the shared database package
COPY packages/shared/database/ ./packages/shared/database/

# Build the shared database package
RUN npm run build --workspace packages/shared/database

# Build the backoffice-backend application
RUN npm run build --workspace apps/backoffice-backend

# Set working directory to the backoffice-backend app
WORKDIR /usr/src/app/apps/backoffice-backend

CMD ["node", "dist/main"]