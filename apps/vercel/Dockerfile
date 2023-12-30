FROM node:lts-alpine3.18

RUN apk update && apk add git vim curl
RUN apk add --no-cache python3 py3-pip
RUN apk add g++ && apk add make

WORKDIR /var/www/app

RUN yarn install
