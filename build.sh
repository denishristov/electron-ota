#!/bin/sh
yarn
yarn workspace shared build
yarn workspace backend build
