#!/bin/bash

# Install lib dependencies
yarn;

# Setup backend components
cp .env.example .env;
docker-compose up -d;


yarn start:dev;
