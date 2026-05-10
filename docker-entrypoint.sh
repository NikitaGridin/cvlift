#!/bin/sh
set -e

if [ "${SKIP_DB_MIGRATIONS:-0}" = "1" ]; then
  echo "Skipping database migrations."
else
  echo "Applying database migrations..."
  ./node_modules/.bin/prisma migrate deploy
fi

exec "$@"
