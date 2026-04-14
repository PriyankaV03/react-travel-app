# Stage 1 — Build the React Router v7 SSR app
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2 — Production runtime
FROM node:20-alpine
WORKDIR /app

# Copy package files and install ONLY production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the built SSR server + client assets
COPY --from=build /app/build ./build

# Cloud Run requires your server to listen on PORT
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Start the React Router SSR server
CMD ["npm", "run", "start"]
