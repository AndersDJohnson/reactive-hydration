#!/bin/bash

set -e

tsc

rm -rf dist-no-jsx-runtime

cp -R dist dist-no-jsx-runtime

find dist-no-jsx-runtime -type f \
  -exec shx sed -i 's/var jsx_runtime_1/\/\/ var jsx_runtime_1/g' {} \; \
  -exec shx sed -i 's/jsx_runtime_1\./global.jsx_runtime_1\./g' {} \; \
  > /dev/null
