# FROM node:alpine 
# WORKDIR /app
# COPY package.json /app/package.json
# RUN npm install
# COPY . /app
# EXPOSE 80
# CMD ["npm", "run","dev"]

# FROM node:alpine AS builder
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# FROM node:alpine
# WORKDIR /app
# COPY --from=builder /app/dist ./dist
# RUN npm install -g serve
# EXPOSE 80
# CMD ["serve", "-s", "dist", "-l", "80"]

# FROM node:alpine AS builder
# WORKDIR /app
# COPY package.json package-lock.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Stage 2: Serve with `serve`
# FROM node:alpine
# WORKDIR /app
# COPY --from=builder /app/dist ./dist
# RUN npm install -g serve
# COPY entrypoint.sh /app/entrypoint.sh
# RUN chmod +x /app/entrypoint.sh
# EXPOSE 80
# ENTRYPOINT ["/app/entrypoint.sh"]
# CMD ["serve", "-s", "dist", "-l", "80"]

# Build stage
FROM node:alpine AS builder
WORKDIR /app

# Accept backend URL as a build argument
ARG BACKEND_BASE_URL
# ENV VITE_BACKEND_BASE_URL=$BACKEND_BASE_URL

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the files
COPY . .

RUN echo "VITE_BACKEND_BASE_URL=$BACKEND_BASE_URL" > .env

# Build the frontend with the correct backend URL
RUN npm run build

# Serve stage
FROM node:alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
RUN npm install -g serve

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]