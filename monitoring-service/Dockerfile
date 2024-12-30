FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Expose metrics port
EXPOSE 9090

# Set environment variables
ENV NODE_ENV=production

# Start the monitoring service
CMD ["node", "src/index.js"]
