FROM node:18-alpine

WORKDIR /cortana

RUN apk add --update git openssh-client python3 make gcc g++

COPY . .

RUN yarn install

CMD yarn start:prod