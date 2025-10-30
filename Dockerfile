# syntax=docker/dockerfile:1

########################
# 1) Dependencias (incluye dev para compilar)
########################
FROM node:22-alpine3.20 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiamos manifiestos y resolvemos deps de forma reproducible
COPY package.json package-lock.json ./
RUN npm ci

########################
# 2) Build (TS -> JS en dist/)
########################
FROM node:22-alpine3.20 AS builder
WORKDIR /app

# node_modules provenientes de deps
COPY --from=deps /app/node_modules ./node_modules

# código fuente
COPY . .

# compilar con tu script "build": nest build
RUN npm run build

########################
# 3) Imagen final (solo prod deps + dist)
########################
FROM node:22-alpine3.20 AS runner
WORKDIR /app
ENV NODE_ENV=production

# Usuario no root por seguridad
RUN addgroup -S app && adduser -S -G app app

# Solo dependencias de producción (sin dev)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Código compilado
COPY --from=builder /app/dist ./dist

# Opcional: healthcheck muy simple (comprueba que exista el entrypoint)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD node -e "process.exit(require('fs').existsSync('./dist/main.js') ? 0 : 1)"

EXPOSE 3000
USER app

# Ejecuta la app
# (Puedes usar también: CMD ["npm","run","start:prod"])
CMD ["node", "dist/main.js"]
