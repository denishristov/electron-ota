FROM node:10.15.1-alpine
RUN mkdir /opt/app
WORKDIR /opt/app

COPY package.json yarn.lock ./
COPY ./shared ./shared
COPY ./backend ./backend

RUN yarn
RUN yarn workspace shared build
RUN yarn workspace backend build
