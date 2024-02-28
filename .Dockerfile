FROM node:21-slim as builder

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm install

EXPOSE 3333
ENTRYPOINT [ "node", "./src/app.js" ]