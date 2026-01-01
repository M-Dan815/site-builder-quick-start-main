# Stage 1: build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build the frontend (React, Vue, etc.)
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config if you have one
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
