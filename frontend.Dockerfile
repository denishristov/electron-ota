FROM node:10.15.1-alpine as builder
ARG serverUrl
RUN mkdir /opt/app
WORKDIR /opt/app
COPY . /opt/app
ENV REACT_APP_SERVER_URL=$serverUrl
RUN yarn \
	&& yarn workspace shared build \
	&& yarn workspace frontend build

FROM nginx:1.15.8-alpine
RUN mkdir /opt/frontend
COPY ./frontend/config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /opt/app/frontend/build /opt/frontend
