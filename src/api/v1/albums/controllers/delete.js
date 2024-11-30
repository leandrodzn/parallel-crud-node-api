// Import the parentPort and workerData objects from the worker_threads module
import { parentPort, workerData } from "node:worker_threads";
// Import the connection object from the models/index.js file
import connection from "../../../../models/index.js";
import Database from "../../../../../config/database.js";

const { Album } = connection;

const { chunk } = workerData;

// Create a new asynchronous function to delete the albums
const deleteAlbums = async () => {
  let transaction = await Database.transaction(); // Transaction
  try {
    // Delete the records
    const response = await Album.destroy({
      where: { AlbumId: chunk },
      transaction,
    });

    // Commit the transaction if the records are deleted successfully
    await transaction.commit();

    parentPort.postMessage({
      message: "Records deleted successfully",
      deleted: response,
    });
  } catch (error) {
    // Rollback the transaction if an error occurs
    if (!transaction?.finished || transaction?.finished !== "commit")
      await transaction.rollback();

    parentPort.postMessage({ error: error.message });
  }
};

// This function will be executed when the worker thread starts
await deleteAlbums();
