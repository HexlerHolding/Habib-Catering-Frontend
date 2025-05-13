# Use Node.js as the base image
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Add package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy rest of the application code
COPY . .

# Set environment variables - replace with your actual API URL
ENV VITE_API_URL=https://api.yourdomain.com

# Build the app
RUN npm run build

# Production stage - using nginx to serve the static files
FROM nginx:alpine

# Copy built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config if you have one
 COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -qO- http://localhost/ || exit 1

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]