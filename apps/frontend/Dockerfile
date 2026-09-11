# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json nx.json ./
COPY . .
RUN npm ci

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the frontend application
RUN npx nx build frontend --prod

# Stage 2: Production server
FROM nginx:alpine AS runner

# Copy the static build output to Nginx's HTML serving directory
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# (Optional) Copy a custom nginx configuration if you handle client-side routing
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
