FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 10000

CMD ["sh", "-c", "npm run start -- --hostname 0.0.0.0 --port ${PORT:-10000}"]
