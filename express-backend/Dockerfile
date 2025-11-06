# --- express-backend/Dockerfile ---
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy dependency files first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project (including src, routes, controllers, .env, etc.)
COPY . .

# Expose backend port
EXPOSE 5000

# Set environment variables (optional, can be overridden by docker-compose)
ENV NODE_ENV=production
ENV PORT=5000

# Start the app
CMD ["node", "src/app.js"]
