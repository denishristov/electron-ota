FROM node:10.15.1-alpine
RUN mkdir /opt/app
WORKDIR /opt/app
COPY package.json yarn.lock ./
COPY ./packages/backend/package.json ./packages/backend/
COPY ./packages/shared/package.json ./packages/shared/
RUN yarn
COPY ./packages/backend ./packages/backend
COPY ./packages/shared ./packages/shared
RUN yarn workspace shared build
RUN yarn workspace backend build \
	&& rm -rf **/node_modules node_modules \
	&& yarn --prod \
	&& yarn cache clean
