# Stage 1 — Build the React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2 — Production server
FROM node:20-alpine

WORKDIR /app

# Copy necessary files from the build stage
COPY --from=build /app/package*.json ./
COPY --from=build /app/build ./build

# Install ONLY production dependencies to keep the image small
RUN npm ci --omit=dev

# The server listens on port 3000 by default in React Router v7
EXPOSE 3000

ENV NODE_ENV=production

# Start the application server
CMD ["npm", "run", "start"]