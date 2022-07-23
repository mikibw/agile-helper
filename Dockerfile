FROM node:14.16.0-alpine3.10

LABEL maintainer tangliang<454251115@qq.com>

WORKDIR /usr/local/agile-helper

COPY package*.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn global add pm2

CMD yarn prd