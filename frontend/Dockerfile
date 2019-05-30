FROM node:10.15.1-alpine as builder
RUN mkdir /opt/app
WORKDIR /opt/app
COPY package.json yarn.lock ./
COPY ./shared ./shared
COPY ./frontend ./frontend

RUN yarn
RUN yarn workspace shared build

ARG serverUri
ENV REACT_APP_SERVER_URI=$serverUri

ARG publicUri
ENV REACT_APP_PUBLIC_API_URI=$publicUri

RUN yarn workspace frontend build

FROM nginx:1.15.8-alpine
RUN mkdir /opt/frontend
COPY ./frontend/config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /opt/app/frontend/build /opt/frontend
