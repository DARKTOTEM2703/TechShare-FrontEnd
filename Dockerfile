## Multi-stage Dockerfile para Next.js (producción)
FROM node:18-alpine AS deps
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci --silent

# Builder
FROM node:18-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# Copiar dependencias y código
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build
RUN npm run build

# Runtime
FROM node:18-alpine AS runner

# Instalar curl para healthchecks
RUN apk add --no-cache curl

# Crear usuario no-root (SEGURIDAD)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

WORKDIR /app
ENV NODE_ENV=production

# Copiar archivos necesarios
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/package-lock.json ./package-lock.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Cambiar a usuario no-root
USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

CMD ["npm", "run", "start"]
