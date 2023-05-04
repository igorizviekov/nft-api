# Use the official Node.js 16 image as the base image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production --frozen-lockfile

# Install NestJS CLI globally
RUN yarn global add @nestjs/cli

# Copy the source code
COPY . .

# Build the application
RUN yarn build

# Log the contents of the dist folder
RUN ls -la /usr/src/app/dist

# Expose the application port
EXPOSE 3000

# Start the application
CMD yarn run start:prod
