FROM node:14.13.1-alpine

RUN mkdir /app
WORKDIR /app

RUN npm install --global @vue/cli @vue/cli-init
