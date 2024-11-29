// Import the parentPort and workerData objects from the worker_threads module
import { parentPort, workerData } from "node:worker_threads";
// Import the connection object from the models/index.js file
import connection from "../../../../models/index.js";

const { Album, Artist } = connection;

const { condition, offset, limit } = workerData;

// Create a new asynchronous function to fetch the albums
const fetchAlbums = async () => {
  try {
    const albums = await Album.findAll({
      where: condition, // Use the condition from the workerData object
      offset: offset, // Use the offset from the workerData object
      limit: limit, // Use the limit from the workerData object
      include: [{ model: Artist }],
    });

    // Serialize the albums
    const serializedAlbums = albums.map((album) => album.toJSON());

    parentPort.postMessage(serializedAlbums); // Send the albums to the parent thread
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
};

// This function will be executed when the worker thread starts
await fetchAlbums();
