FROM node:10.15.1-alpine as builder
RUN mkdir /opt/app
WORKDIR /opt/app
COPY . /opt/app
RUN find ./packages -maxdepth 1 -not -name packages -not -name backend -not -name shared | xargs rm -rf \
	&& yarn \
	&& yarn workspace shared build \
	&& yarn workspace backend build \
	&& rm -rf **/node_modules node_modules \
	&& yarn --prod
