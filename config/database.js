"use strict";
process.loadEnvFile();

import { Sequelize } from "sequelize";

let config = {
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  dialect: "mysql",
  logging: false,
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
  }
);

export default sequelize;
