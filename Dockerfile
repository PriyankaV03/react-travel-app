# Stage 1 — Build the React app
FROM node:20.20.2-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2 — Serve with Nginx
FROM nginx:1.25-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]