#!/bin/sh
# Stamp a new version so phones load the latest app right away instead of a cached copy.
# Run before every commit that changes docs/.
set -e
cd "$(dirname "$0")/../docs"
V=$(date -u +%Y%m%d%H%M%S)
printf '%s' "$V" > version.txt
sed -i -E "s/(app\.js|data\.js|config\.js|style\.css)(\?v=[0-9]+)?\"/\1?v=$V\"/g; s/window\.APP_V=\"[0-9]*\"/window.APP_V=\"$V\"/" index.html
echo "version $V"
