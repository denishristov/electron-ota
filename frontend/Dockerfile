FROM node:10.15.1-alpine as builder
RUN mkdir /opt/app
WORKDIR /opt/app
COPY package.json yarn.lock ./
COPY ./frontend/package.json ./frontend/
COPY ./shared/package.json ./shared/
RUN yarn && yarn cache clean
# Clearing yarn cache because intermediate container is too large to be cached
COPY ./shared ./shared
RUN yarn workspace shared build
COPY ./frontend ./frontend
ARG serverUrl
ENV REACT_APP_SERVER_URL=$serverUrl
RUN yarn workspace frontend build

FROM nginx:1.15.8-alpine
RUN mkdir /opt/frontend
COPY ./frontend/config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /opt/app/frontend/build /opt/frontend
