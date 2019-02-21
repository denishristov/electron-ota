FROM node:10.15.1-alpine as builder
RUN mkdir /opt/app
WORKDIR /opt/app
COPY . /opt/app
RUN yarn \
	&& yarn workspace shared build \
	&& yarn workspace backend build \
	&& rm -r **/node_modules node_modules \
	&& yarn --prod
