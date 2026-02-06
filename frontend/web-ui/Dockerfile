
# Node build stage
FROM node:alpine3.21 AS build
WORKDIR /app

# Private registry settings
COPY .npmrc ./

# Dependencies
COPY package*.json ./
RUN npm install

# Source + build
COPY . .
RUN npm run build

# Nginx production stage
FROM nginx:1.27-alpine

# Ensure entrypoint hooks directory exists (usually present in nginx:alpine)
RUN mkdir -p /docker-entrypoint.d

# Serve built app
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist .

# Set proper permissions for static files
RUN chmod -R 755 /usr/share/nginx/html && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} \;

# Nginx config
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types

# Runtime config generator
COPY generate-config.sh /docker-entrypoint.d/generate-config.sh
RUN chmod +x /docker-entrypoint.d/generate-config.sh \
    && apk add --no-cache dos2unix \
    && dos2unix /docker-entrypoint.d/generate-config.sh \
    && apk del dos2unix

# Expose the port Nginx listens on (ensure this matches nginx.conf `listen`)
EXPOSE 5173

# IMPORTANT: keep nginx's default entrypoint and command
# nginx:alpine has ENTRYPOINT ["/docker-entrypoint.sh"]
# It will run *.sh in /docker-entrypoint.d and then start nginx
