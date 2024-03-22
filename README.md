<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Salary Hero Backend

## Description

Salary payment project support partner register, config and manage their worker account, 
their worker salary and formula. From that, worker salary will be calculated
automatically every day, every month and worker can manage 
their money.

## Design
### Basic High Level Design Overview
![alt text](https://github.com/matthew-nguyen-20032023/salary-hero-backend/blob/dev/docs/images/overview-system/high-level-design.png?raw=true)
### Low Level Design With AWS Cloud
![alt text](https://github.com/matthew-nguyen-20032023/salary-hero-backend/blob/dev/docs/images/overview-system/low-level-design-with-aws-cloud.png?raw=true)

## Required
Node version v18.13.0 <br />
Yarn version 1.22.19 <br />
Docker version 20.10.21, build 20.10.21-0ubuntu1~22.04.3 <br/>
docker-compose version 1.29.2, build unknown

## Quick Start
```bash
# Coming soon
```

## Setup
### Setup components
```bash
# Preparing
$ yarn                          # install lib dependencies
$ cp .env.example .env          # init .env file (change information if you want to) 
$ docker-compose up -d          # init services component (depend on .env file, noted new docker version run docker compose up -d)
$ npm run typeorm:run           # migrate database schema
$ npm run typeorm:test          # migrate testing database schema
$ yarn console:dev seeding-data # seeding data for develop
```
### Run Backend
```bash
# For development run
$ yarn start:dev 
#-----------------------------#
# Or for production run
$ yarn build
$ yarn start:prod
```
### Background Job Handle worker salary calculation 
```bash
# For development run
$ yarn console:dev calculate-worker-salary
#-----------------------------#
# For production run
$ node dist/src/console.js calculate-worker-salary
```
### Testing
```bash
$ yarn test
```

## Some Feature Can Implement In The Future
- OTP to withdraw or transfer money for worker

## Repository Activity
![Alt](https://repobeats.axiom.co/api/embed/1929095ae8b4fb2d5d5dbc561ad4e906db6dd2b7.svg "Repobeats analytics image")
## License

  Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
