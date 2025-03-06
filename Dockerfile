# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Build the Next.js app
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Set to production environment
# Set to production environment
ENV NODE_ENV=production

# Add a non-root user to run the app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Set the correct ownership
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]

