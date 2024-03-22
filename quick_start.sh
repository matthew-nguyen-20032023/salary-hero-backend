#!/bin/bash

# Preparing
yarn                          # install lib dependencies
cp .env.example .env          # init .env file (change information if you want to)
yarn build
docker-compose up -d          # init services component (depend on .env file, noted new docker version run docker compose up -d)
npm run typeorm:run           # migrate database schema
npm run typeorm:test          # migrate testing database schema
yarn console:dev seeding-data # seeding data for develop
yarn test                     # testing
pm2 restart ecosystem.config.js
