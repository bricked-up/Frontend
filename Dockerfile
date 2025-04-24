# Use the latest LTS version of Node.js on Alpine Linux
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY . .

# Install dependencies
RUN apk update && apk upgrade
RUN apk add --no-cache git
RUN npm install --legacy-peer-deps --force

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]
