# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json pnpm-lock.yaml ./

# Install pnpm and dependencies
RUN npm install -g pnpm@latest
RUN pnpm install

# Copy source code
COPY . .

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build application
RUN pnpm build

# Copy standalone server files
RUN cp -r .next/static .next/standalone/.next/
RUN cp -r public .next/standalone/

# Expose port
EXPOSE 3000

# Start application with standalone server
CMD ["node", ".next/standalone/server.js"]