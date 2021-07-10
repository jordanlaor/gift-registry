# Choose the image for the container
FROM node:16.3.0
# Define the base dir
WORKDIR /app
# Copy the package.json files to the workdir
COPY ./package.json ./
COPY ./package-lock.json ./
# Define the NODE_ENV
ENV NODE_ENV production
# Install the node modules
RUN npm ci --only=production
RUN npm prune
# Copy the project to the workdir
COPY . ./
# Allow to listen to port 5000
EXPOSE 5000
# Run the project
CMD ["npm", "start"]