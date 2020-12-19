#!/bin/sh

set -e

npm set progress false
npm install --no-optional
npm prune

rm -rf ./dist
rm -rf ./dist-zip

npm run build
npm run build-zip
