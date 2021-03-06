#### Stage 1: Build the react application
# FROM node:12.4.0-alpine as build

# # Configure the main working directory inside the docker image. 
# # This is the base directory used in any further RUN, COPY, and ENTRYPOINT 
# # commands.
# WORKDIR /app

# # Copy the package.json as well as the package-lock.json and install 
# # the dependencies. This is a separate step so the dependencies 
# # will be cached unless changes to one of those two files 
# # are made.
# COPY package.json package-lock.json ./
# RUN npm install

# # Copy the main application
# COPY . ./

# # ENVS to then be used by .env.production compiled with webpack
# ARG API_BASE_URL
# ENV API_BASE_URL=${API_BASE_URL}

# ARG CLOUDINARY_UPLOAD_PRESET
# ENV CLOUDINARY_UPLOAD_PRESET=${CLOUDINARY_UPLOAD_PRESET}

# ARG CLOUDINARY_URL
# ENV CLOUDINARY_URL=${CLOUDINARY_URL}

# # Build the application
# RUN npm run build

# Set nginx base image
FROM nginx

# Copy the react build from Stage 1
# COPY --from=build /app/dist /var/www
COPY ./dist /var/www

# Copy custom configuration file from the current directory
COPY nginx.conf /etc/nginx/nginx.conf