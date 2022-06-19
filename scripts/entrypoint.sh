#!/bin/sh

set -e

yarn install --frozen-lockfile

rm -rf ./dist/*

yarn start
