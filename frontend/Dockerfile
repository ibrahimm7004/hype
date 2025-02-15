# Use the official Node.js image as the base image
FROM node:18-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Vite app
RUN npm run build

# Use a lightweight web server for serving static files
FROM nginx:alpine

# Set custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output to Nginx's web directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 instead of 5173 (Nginx default)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
