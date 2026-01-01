FROM node:20-bookworm

# Install OpenJDK 17 (often required for Allure or Java-based tools)
RUN apt-get update && \
    apt-get install -y default-jdk && \
    apt-get clean;

WORKDIR /app

# Copy package definition
COPY package*.json ./

# Install dependencies (CI for strict lockfile usage)
RUN npm ci

# Copy the rest of the application
COPY . .

# Default command (can be overridden in docker-compose)
CMD ["npm", "run", "test"]
