## Multi-stage Dockerfile para Next.js (producción)
## Stage 1: builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production=false

# Copiar el resto del código
COPY . .

# Construir la app
RUN npm run build

## Stage 2: runner
FROM node:18-alpine AS runner
WORKDIR /app

# Establecer entorno de producción
ENV NODE_ENV=production

# Copiar artefactos del builder
COPY --from=builder /app/ .

# Exponer puerto
EXPOSE 3000

# Ejecutar Next.js en modo producción
CMD ["npm", "run", "start"]
