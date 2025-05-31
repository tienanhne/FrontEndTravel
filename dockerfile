# Use Node.js 20.16.0 as the base image
FROM node:20.16.0-alpine

WORKDIR /app

COPY package.json .
RUN npm i -force

COPY . .

## EXPOSE [Port you mentioned in the vite.config file]



CMD ["npm", "run", "dev"]



# Use an official Node.js runtime as the base image
FROM node:18-alpine as build

# # Set the working directory
WORKDIR /app

# # Copy package.json and package-lock.json
COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Build the application
# RUN npm run build

# # Use a lightweight web server to serve the built files
FROM nginx:stable-alpine

# # Copy the built files to the nginx HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# # Expose the port
EXPOSE 80

# # Start nginx
CMD ["nginx", "-g", "daemon off;"]

