#!/bin/sh
set -e

if [ "${SKIP_DB_MIGRATIONS:-0}" = "1" ]; then
  echo "Skipping database migrations."
else
  echo "Applying database migrations..."
  node ./node_modules/prisma/build/index.js migrate deploy
fi

exec "$@"
