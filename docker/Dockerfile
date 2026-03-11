FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 5000

CMD ["sh", "-c", "node api/server.js & node scraper/scheduler.js"]
