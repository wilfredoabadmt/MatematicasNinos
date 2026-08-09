# Multi-stage Dockerfile para servidor Node.js + Express + SQLite + Vite SPA en Coolify
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Producción: Servidor Express en Puerto 80 para Coolify / Traefik
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80
ENV DATABASE_DIR=/app/data

# Instalar dependencias necesarias para better-sqlite3 y compilación nativa en Alpine
RUN apk add --no-cache python3 make g++ sqlite-dev || true

COPY package*.json ./
RUN npm ci --only=production

COPY --from=build /app/dist ./dist
COPY server.js ./

RUN mkdir -p /app/data

EXPOSE 80

CMD ["node", "server.js"]
