# Stage 1: Build the Vite React app
FROM node:22 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for better caching
COPY web/package*.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend source code
COPY web/ .

# Build the Vite app
RUN npm run build

# Stage 2: Serve the built assets with Nginx
FROM nginx:stable

# Remove default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the built files from the previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
