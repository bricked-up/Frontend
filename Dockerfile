# Use LTS Node image with Alpine for small size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package.json and lock file first
COPY package*.json ./

# Install dependencies cleanly
RUN npm install --legacy-peer-deps --force

# Copy the rest of the project
COPY . .

# Expose React port
EXPOSE 3000
ENV DANGEROUSLY_DISABLE_HOST_CHECK=true

# Start the app
CMD ["npm", "start"]