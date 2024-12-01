# Parallel CRUD operations in API with Node.js

## Table of contents

- [Parallel CRUD operations in API with Node.js](#parallel-crud-operations-in-api-with-nodejs)
  - [Table of contents](#table-of-contents)
  - [Description](#description)
  - [Parallelism using Worker Threads](#parallelism-using-worker-threads)
    - [How does it work?](#how-does-it-work)
      - [Division of the workload](#division-of-the-workload)
      - [Workers creation](#workers-creation)
      - [Asynchronous communication](#asynchronous-communication)
      - [Results consolidation](#results-consolidation)
    - [Relationship between Workers and CPU Cores](#relationship-between-workers-and-cpu-cores)
      - [Is a Worker a Core?](#is-a-worker-a-core)
    - [Advantages](#advantages)
    - [Disadvantages or considerations](#disadvantages-or-considerations)
  - [Tests and results](#tests-and-results)
    - [Database](#database)
    - [Request examples](#request-examples)
    - [Results](#results)
      - [Albums](#albums)
  - [Run locally](#run-locally)
    - [Node version](#node-version)
    - [Clone the project](#clone-the-project)
    - [Go to the project directory](#go-to-the-project-directory)
    - [Install dependencies](#install-dependencies)
    - [Create .env file](#create-env-file)
    - [Start server](#start-server)
  - [Authors](#authors)
  - [Build with](#build-with)

## Description

Parallelizing CRUD operations on relational databases using Node.js

<br>

## Parallelism using Worker Threads

The project implements a parallel extraction, creation and deletion of data from a database using the Worker Threads API in Node.js.

### How does it work?

#### Division of the workload

The total number of records or actions to be performed is obtained.
A chunk is calculated to determine how many records each worker must handle.

#### Workers creation

Multiple workers (subprocesses) are created using new Worker() to execute tasks in parallel. Each worker receives data to perform its process.

#### Asynchronous communication

Workers send results back to the main process via message events.
Errors are handled with error and exit to ensure that workers finish correctly.

#### Results consolidation

Promise.all() waits for all workers to finish their task.
The results are combined to generate a response from the endpoint.

### Relationship between Workers and CPU Cores

Workers in Node.js are threads that run in parallel to the main thread.
Each worker has its own execution context, memory and independent process within the Node.js application.

#### Is a Worker a Core?

Not directly. A worker is a thread, and the operating system is responsible for assigning that thread to an available core. In a multi-core system, several workers can run in parallel, one per core, but they are not directly tied to a specific core.

> **_Example_:**
>
> If you have a 4-core CPU and you launch 4 workers:
>
> The operating system will probably assign each worker to a different core.
> If you launch more workers than cores (for example, 8 workers on a 4-core CPU), the cores will manage multiple threads through multitasking.

### Advantages

- Effective parallelism: Each worker handles a part of the data, which can improve efficiency in systems with many cores.
- Scalability: The number of workers can be dynamically adjusted according to the workload.
- Asynchrony: The main process does not block during the execution of the workers.

### Disadvantages or considerations

- Thread overhead: If the data is not large, the use of multiple threads may be less efficient due to the overhead of creating and communicating workers.
- System load: Redistributing the load may saturate the CPU or the database if the number of workers is too high.
- Shared state: Workers do not share memory, so each one needs to fetch data separately.

## Tests and results

### Database

As test database we use the incremental MySQL version of [chinook_database](https://github.com/lerocha/chinook-database)

### Request examples

To test the API endpoints you can use the following [test requests](/request_examples/).

Send request to:

```sh
  http://localhost:PORT/api/v1/ENDPOINT
```

### Results

The tests were performed on a computer with the following specifications:

- AMD Ryzen 5 8645HS 4.3 GHz processor with 6 CPU Cores and 12 Threads.

#### Albums

**Create**

Sending 660 album objects to create.

| Worker threads | Time (milliseconds) | Speedup | Efficiency |
| -------------- | ------------------- | ------- | ---------- |
| **1**          | 3213.19959          | 1       | 1          |
| **2**          | 2225.44639          | 1.44384 | 0.72192    |
| **3**          | 1990.63120          | 1.61416 | 0.53805    |
| **4**          | 1742.41379          | 1.84410 | 0.46102    |
| **6**          | 1535.67530          | 2.09236 | 0.34872    |
| **8**          | 1477.85349          | 2.21928 | 0.27741    |
| **10**         | 1567.99890          | 2.04923 | 0.20492    |
| **12**         | 1526.42799          | 2.10504 | 0.17542    |

<br>

**Read**

Fetching 18147 albums.

| Worker threads | Time (milliseconds) | Speedup | Efficiency |
| -------------- | ------------------- | ------- | ---------- |
| **1**          | 994.46590           | 1       | 1          |
| **2**          | 877.04560           | 1.13388 | 0.56694    |
| **3**          | 900.73999           | 1.10405 | 0.23801    |
| **4**          | 861.67410           | 1.15410 | 0.28852    |
| **6**          | 950.91939           | 1.04579 | 0.17429    |
| **8**          | 924.97970           | 1.07512 | 0.13439    |
| **10**         | 1115.14129          | 0.89178 | 0.08917    |
| **12**         | 1259.76939          | 0.78940 | 0.06578    |

<br>

**Delete**

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

### Start server

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

[requestExamplesRef]: /request-examples
