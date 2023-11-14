FROM node:18.17.1-alpine3.18

WORKDIR /app

COPY . /app/

RUN npm ci

CMD ["node", "index.js"]
