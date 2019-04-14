FROM node:10.15.1-alpine
RUN mkdir /opt/app
WORKDIR /opt/app
COPY package.json yarn.lock ./
COPY ./backend/package.json ./backend/
COPY ./shared/package.json ./shared/
RUN yarn
ENV NODE_ENV=production
COPY ./shared ./shared
RUN yarn workspace shared build
COPY ./backend ./backend
RUN yarn workspace backend build \
	&& rm -rf **/node_modules node_modules \
	&& yarn --prod \
	&& yarn cache clean
