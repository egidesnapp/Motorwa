#!/bin/sh
cd /app/packages/database
npm install --silent
npx prisma migrate deploy
