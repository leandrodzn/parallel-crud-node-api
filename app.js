process.loadEnvFile();

import express from "express";
import api from "./src/api/v1/index.js"; // Load the API routes
import logger from "morgan";
import connection from "./src/models/index.js";

const app = express();

// Middleware for parsing request bodies
app.use(express.json());

app.use(logger("dev")); // Log requests to the console

await api(app); // Load the API routes

// Initialize the connection to the database
await connection.init();

const port = process.env.APP_PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
