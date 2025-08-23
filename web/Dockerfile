
# Base image
FROM node:22-alpine AS base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app
COPY package*.json ./
EXPOSE 3000

# Builder stage
FROM base AS builder
WORKDIR /app
COPY . .
RUN npm run build

# Development stage
FROM base as dev
ENV NODE_ENV=development
RUN npm install 
COPY . .
CMD npm run dev