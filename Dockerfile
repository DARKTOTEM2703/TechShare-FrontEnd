# Dockerfile para Frontend Next.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias (incluir devDependencies para desarrollo)
RUN npm ci

# Copiar el código fuente
COPY . .

# Exponer puerto 3000
EXPOSE 3000

# Comando para ejecutar en modo desarrollo
CMD ["npm", "run", "dev"]
