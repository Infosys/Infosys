# Node build stage
FROM node:alpine3.21 AS build
WORKDIR /app

# Copy .npmrc for private registry configuration
COPY .npmrc ./

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code and configuration files
COPY . .

# Build the application
RUN npm run build

# Nginx production stage
FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx content
RUN rm -rf ./*

# Copy built application from build stage
COPY --from=build /app/dist .

# Set proper permissions for nginx to read files
RUN chmod -R 755 /usr/share/nginx/html

# Copy nginx configuration and mime types
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types

# Expose the port that nginx is configured to listen on
EXPOSE 5173

# Start nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
 