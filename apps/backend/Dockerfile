FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json for the root project
COPY package*.json ./

# Install root dependencies (this will also install shared/database dependencies if linked)
RUN npm install

# Copy the entire project from the build context (which is the root)
COPY . .

# Build the shared database package
RUN npm run build --workspace packages/shared/database

# Build the backend application
RUN npm run build --workspace apps/backend

# Set working directory to the backend app
WORKDIR /usr/src/app/apps/backend

CMD ["node", "dist/main"]
