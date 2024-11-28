"use strict";

import fs from "fs/promises";
import path from "path";
import { Sequelize } from "sequelize";
import sequelize from "../../config/database.js";
import { fileURLToPath, pathToFileURL } from "node:url";

// Obtain the current file name and the directory where it is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const connection = {}; // Objeto para almacenar los modelos

// Function to load all models dynamically
const loadModels = async () => {
  try {
    const files = await fs.readdir(__dirname); // Read current directory

    for (const file of files) {
      if (
        file.indexOf(".") !== 0 && // Ignore hidden files
        file !== basename && // Ignore this file
        file.slice(-3) === ".js" // Load only JavaScript files
      ) {
        const filePath = path.join(__dirname, file); // Get the full path of the file
        const fileUrl = pathToFileURL(filePath).href; // Convert the path to a URL

        // Import the model dynamically
        const { default: modelFactory } = await import(fileUrl);
        const model = modelFactory(sequelize, Sequelize.DataTypes); // Instance the model
        connection[model.name] = model; // Add the model to the connection object
      }
    }

    // Execute the associate method of each model
    Object.keys(connection).forEach((modelName) => {
      if (connection[modelName].associate) {
        connection[modelName].associate(connection);
      }
    });

    connection.Sequelize = Sequelize;
  } catch (error) {
    throw new Error({ msg: "Error loading models", error });
  }
};

// Load the models
await loadModels();

// Initialize the connection
connection.init = async () => {
  try {
    await sequelize.authenticate(); // Test the connection to the database
    await sequelize.sync({ alter: true }); // Synchronize the models with the database
  } catch (error) {
    throw new Error({ msg: "Error connecting to the database", error });
  }
};

connection.init();

export default connection;
