# Use the official Node.js 14 image as the base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application into the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port the application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
