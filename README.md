# Parallel CRUD operations in API with Node.js

## Table of contents

- [Parallel CRUD operations in API with Node.js](#parallel-crud-operations-in-api-with-nodejs)
  - [Table of contents](#table-of-contents)
  - [Description](#description)
  - [Run locally](#run-locally)
    - [Node version](#node-version)
    - [Clone the project](#clone-the-project)
    - [Go to the project directory](#go-to-the-project-directory)
    - [Install dependencies](#install-dependencies)
    - [Create .env file](#create-env-file)
    - [Start Server](#start-server)
  - [Authors](#authors)
  - [Build with](#build-with)

## Description

Parallelizing CRUD operations on relational databases using Node.js
<br>

## Run locally

### Node version

Install Node v. 22.11.0 and use for this project

### Clone the project

bash

```sh
  git clone https://github.com/leandrodzn/parallel-crud-node-api.git
```

### Go to the project directory

bash

```sh
  cd parallel-crud-node-api
```

### Install dependencies

bash

```sh
  npm install
```

### Create .env file

Variables

```bash

APP_PORT=3000

DATABASE_HOST=
DATABASE_PORT=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=

```

### Start Server

bash

```sh
  npm run dev
```

<br>

## Authors

- **Domingo Ciau Uc**

  [![GitHub](https://img.shields.io/badge/GitHub-DomingoCiau02-red?style=flat&logo=github)](https://github.com/DomingoCiau02)

- **Belen Couoh Chan**

  [![GitHub](https://img.shields.io/badge/GitHub-Belen2708-pink?style=flat&logo=github)](https://github.com/Belen2708)

- **Leandro Dzib Nauat**

  [![GitHub](https://img.shields.io/badge/GitHub-leandrodzn-green?style=flat&logo=github)](https://github.com/leandrodzn)

## Build with

- [NodeJs](https://nodejs.org/es) - Server runtime environment Version (^ v22.11.0)
- [Express](https://expressjs.com/) - Framework
- [MySQL](https://www.mysql.com/) - Database
- [Sequelize](https://sequelize.org/) - Database ORM
