# Multi-stage Dockerfile para servidor Node.js + Express + SQLite + Vite SPA en Coolify
FROM node:20-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Producción: Servidor Express en Puerto 3000 para Coolify Traefik
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_DIR=/app/data

# Instalar herramientas del sistema para compilar native modules (better-sqlite3)
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    python3 \
    make \
    g++ \
    sqlite3 \
    libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --only=production && npm rebuild better-sqlite3

COPY --from=build /app/dist ./dist
COPY server.js ./

RUN mkdir -p /app/data

EXPOSE 3000

CMD ["node", "server.js"]
