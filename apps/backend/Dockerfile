# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy root dependency files
COPY package*.json nx.json ./

# Copy the entire monorepo source code
COPY . .

# Install all dependencies (including devDependencies needed for Nx build)
RUN npm ci

# Build the specific Nx application
RUN npx nx build backend --prod


# Stage 2: Migrator
FROM builder AS migrator
WORKDIR /app
CMD ["npx", "drizzle-kit", "migrate"]

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built artifacts from the builder stage
COPY --from=builder /app/apps/backend/dist ./

# Install only production dependencies to keep the image lightweight
COPY package*.json ./
RUN npm ci --only=production

EXPOSE 3000

CMD ["node", "main.js"]