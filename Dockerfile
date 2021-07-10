# Choose the image for the container  - build process
FROM node:16.3.0 as build-deps
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
# Build project
RUN npm run build

# Choose the image for the container  - Run the build
FROM nginx:1.20.1-alpine
# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove default nginx static assets
RUN rm -rf ./*
COPY --from=build-deps /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
