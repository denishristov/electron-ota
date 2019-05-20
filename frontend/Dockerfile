FROM node:10.15.1-alpine as builder
RUN mkdir /opt/app
WORKDIR /opt/app
COPY package.json yarn.lock ./
COPY ./frontend/package.json ./frontend/
COPY ./shared/package.json ./shared/

COPY ./shared ./shared
RUN yarn workspace shared build
COPY ./frontend ./frontend
RUN yarn workspace frontend build

FROM nginx:1.15.8-alpine
RUN mkdir /opt/frontend
COPY ./frontend/config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /opt/app/frontend/build /opt/frontend
