# Use official Node.js 22 image
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the container
COPY package.json pnpm-lock.yaml ./

# Install pnpm package manager globally
RUN npm i -g pnpm @nestjs/cli

# Install dependencies
RUN pnpm install

# Copy all source files into the container
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port 4000 for the application
EXPOSE 4000

# Start the app in production mode
CMD ["pnpm", "run", "start:prod"]