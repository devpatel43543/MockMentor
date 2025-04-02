# FROM node:alpine 
# WORKDIR /app
# COPY package.json /app/package.json
# RUN npm install
# COPY . /app
# EXPOSE 80
# CMD ["npm", "run","dev"]
FROM node:alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve
EXPOSE 80
CMD ["serve", "-s", "dist", "-l", "80"]