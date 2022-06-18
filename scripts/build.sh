#!/bin/sh

set -e

yarn install --frozen-lockfile

rm -rf ./dist
rm -rf ./dist-zip

yarn build
yarn build-zip
