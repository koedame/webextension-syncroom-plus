#!/bin/sh

set -e

npm set progress false
npm install --no-optional
npm prune
npm run watch:dev
