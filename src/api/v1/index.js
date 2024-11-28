"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "node:url";

// Obtain the current file name and the directory where it is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

// function to get all the folders and files in the routes folder
const getFoldersAndFiles = (defaultFolderName) => {
  let files = [];

  fs.readdirSync(__dirname, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory()) // Only get the folders
    .forEach((dirent) => {
      const folderName = dirent.name; // Get the name of the folder

      // Create the full path of the "routes" folder
      const routesFolderPath = path.join(
        __dirname,
        folderName,
        defaultFolderName
      );

      // Verify if the "routes" folder exists
      if (fs.existsSync(routesFolderPath)) {
        const routeFile = path.join(routesFolderPath, "index.js");

        // Verify if the "index.js" file exists
        if (fs.existsSync(routeFile)) {
          files.push({ name: folderName, file: routeFile });
        }
      }
    });

  return files;
};

const api = async (app) => {
  const files = getFoldersAndFiles("routes");

  for (const folder of files) {
    if (
      // check if the file is a JavaScript file
      folder["file"].indexOf(".") !== 0 &&
      folder["file"].slice(-3) === ".js"
    ) {
      const { default: file } = await import(
        pathToFileURL(folder["file"]).href
      );

      for (const route of file?.routes || []) {
        const { method, path, action } = route;

        const globalPath = `/api/v1${path}`;

        switch (method) {
          case "get":
            app.get(globalPath, action);
            break;

          case "post":
            app.post(globalPath, action);
            break;

          case "put":
            app.put(globalPath, action);
            break;

          case "delete":
            app.delete(globalPath, action);
            break;

          case "patch":
            app.patch(globalPath, action);
            break;

          default:
            break;
        }
      }
    }
  }
};

export default api;
