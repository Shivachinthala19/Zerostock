# Use the official Node.js 20 slim image
FROM node:20-slim

# Install system dependencies needed for sqlite3 build
# We need python3, make, and g++ for native module compilation
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
# --build-from-source ensures sqlite3 is built for this specific environment
RUN npm install --build-from-source sqlite3

# Copy the rest of the application code
COPY . .

# Create the database and seed it (optional, can be done via CMD or manual shell)
# RUN node src/db/seed.js

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable for the port
ENV PORT=3000

# Start the application
CMD ["node", "server.js"]
