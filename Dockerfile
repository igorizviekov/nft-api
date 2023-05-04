# Use the official Node.js 14 image as the base image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json, yarn.lock, and other necessary files into the working directory
COPY package.json ./
COPY yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application into the working directory
COPY . .

# Build the application
RUN yarn build


# Expose the port the application will run on
EXPOSE 3000

# Start the application
CMD ["yarn", "start:prod"]
