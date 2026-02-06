# Node build stage
FROM node:alpine3.21 AS node
WORKDIR /storybook-app

# Copy only necessary package files
COPY package*.json ./
COPY .npmrc ./

# Install dependencies
RUN npm install -g typescript
RUN npm install

# Copy only Storybook-related files
COPY .storybook/ ./.storybook/
COPY stories/ ./stories/
COPY src/ ./src/
COPY tsconfig*.json ./
COPY vite.config.ts ./

# Build Storybook
RUN npm run build-storybook

# Nginx production stage
FROM nginx:1.27
WORKDIR /usr/share/nginx/html

# Remove default nginx content
RUN rm -rf ./*

# Copy built Storybook from node stage
COPY --from=node /storybook-app/storybook-static .

# Set proper permissions for nginx to read files
RUN chmod -R 755 /usr/share/nginx/html

# Copy nginx configuration and mime types
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types

# Expose the port that nginx is configured to listen on
EXPOSE 5173

# Start nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
 