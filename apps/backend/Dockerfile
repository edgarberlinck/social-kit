# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

RUN npm install
RUN npm run prisma:generate
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/apps/backend ./apps/backend
COPY --from=builder /usr/src/app/packages/shared/database ./packages/shared/database
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /usr/src/app/node_modules/.prisma ./node_modules/.prisma

RUN npm install --workspace apps/backend --omit=dev
RUN ls -R /app/node_modules/@prisma
RUN ls -R /app/node_modules/.prisma || true
WORKDIR /app/apps/backend
CMD ["node", "dist/main"]
