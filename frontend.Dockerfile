FROM node:10.15.1-alpine as builder
ARG serverUrl
RUN mkdir /opt/app
WORKDIR /opt/app
ENV REACT_APP_SERVER_URL=$serverUrl
COPY package.json yarn.lock ./
COPY ./packages/frontend/package.json ./packages/frontend/
COPY ./packages/shared/package.json ./packages/shared/
RUN yarn
COPY ./packages/frontend ./packages/frontend
COPY ./packages/shared ./packages/shared
RUN yarn workspace shared build
RUN yarn workspace frontend build

FROM nginx:1.15.8-alpine
RUN mkdir /opt/frontend
COPY ./packages/frontend/config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /opt/app/packages/frontend/build /opt/frontend
