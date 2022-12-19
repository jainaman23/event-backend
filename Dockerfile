FROM node:16.17.1-alpine

RUN apk add python3

RUN apk add --no-cache --virtual .gyp \
    make \
    curl \
    g++ \
    bash \
    git

WORKDIR /hiring-backend

COPY . /hiring-backend/

RUN npm ci

ENV PORT="3000"

CMD [ "npm", "start" ]

EXPOSE ${PORT}