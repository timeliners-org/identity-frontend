# Use Node.js LTS Alpine for smaller image size
FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", ".output/server/index.mjs"]
