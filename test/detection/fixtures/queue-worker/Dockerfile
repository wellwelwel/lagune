FROM node:22.11.0-alpine3.20

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

USER node

CMD ["node", "src/worker.js"]
