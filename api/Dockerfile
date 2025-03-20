# Use Node.js version 22 as the base image
FROM node:22

# Set the working directory in the container to /api
WORKDIR /api

# Copy package.json and package-lock.json from the API folder into the container
COPY api/package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally
RUN npm install -g nodemon

# Copy the entire API source code into the container
COPY api/ .

# Expose the port that your API listens on (adjust if needed)
EXPOSE 3000

# Use nodemon to run your API.
CMD ["npm", "run", "nodemon"]
