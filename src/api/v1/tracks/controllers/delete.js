// Import the parentPort and workerData objects from the worker_threads module
import { parentPort, workerData } from "node:worker_threads";
// Import the connection object from the models/index.js file
import connection from "../../../../models/index.js";
import Database from "../../../../../config/database.js";

const { Track, InvoiceLine, PlaylistTrack } = connection;

const { chunk } = workerData;

// Create a new asynchronous function to delete the tracks
const deleteTracks = async () => {
  let transaction = await Database.transaction(); // Transaction
  try {
    const playlistTracks = await PlaylistTrack.destroy({
      where: { TrackId: chunk },
      transaction,
    });

    const invoiceLines = await InvoiceLine.destroy({
      where: { TrackId: chunk },
      transaction,
    });

    // Delete the records
    const tracks = await Track.destroy({
      where: { TrackId: chunk },
      transaction,
    });

    // Commit the transaction if the records are deleted successfully
    await transaction.commit();

    parentPort.postMessage({
      message: "Records deleted successfully",
      deleted: {
        playlistTracks,
        invoiceLines,
        tracks,
      },
    });
  } catch (error) {
    // Rollback the transaction if an error occurs
    if (!transaction?.finished || transaction?.finished !== "commit")
      await transaction.rollback();

    parentPort.postMessage({ error: error.message });
  }
};

// This function will be executed when the worker thread starts
await deleteTracks();
