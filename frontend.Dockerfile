FROM node:10.15.1-alpine as builder
ARG serverUrl
RUN mkdir /opt/app
WORKDIR /opt/app
COPY . /opt/app
ENV REACT_APP_SERVER_URL=$serverUrl
RUN find ./packages -maxdepth 1 -not -name packages -not -name frontend -not -name shared | xargs rm -rf \
	&& yarn \
	&& yarn workspace shared build \
	&& yarn workspace frontend build

FROM nginx:1.15.8-alpine
RUN mkdir /opt/frontend
COPY ./packages/frontend/config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /opt/app/packages/frontend/build /opt/frontend
