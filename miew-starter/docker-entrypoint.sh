#!/bin/sh
set -e

echo "Running Prisma migrations..."
# If you have a specific command to run migrations, replace the following line with that command.
# prisma migrate must be disabled in production, so you should run the migrations manually before starting the application.
# npx prisma migrate deploy --config=prisma.config.ts
echo "Migrations applied successfully."

exec node dist/main
