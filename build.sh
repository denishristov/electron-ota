#!/bin/sh
yarn

yarn workspace shared build
yarn workspace backend build
yarn workspace sample-electron-app build.1.0.0