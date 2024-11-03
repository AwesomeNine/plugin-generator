#!/bin/sh

rm -r packages || true
COMPOSER_VENDOR_DIR=packages composer install -o -a -n --no-dev --no-scripts
composer dump
npx mix -p -- --env wpPot
