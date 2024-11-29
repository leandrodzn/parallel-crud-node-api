// Import the parentPort and workerData objects from the worker_threads module
import { parentPort, workerData } from "node:worker_threads";
// Import the connection object from the models/index.js file
import connection from "../../../../models/index.js";

const { Album, Artist, Track } = connection;

const { condition, offset, limit } = workerData;

// Create a new asynchronous function to fetch the albums
const fetchTracks = async () => {
  try {
    const tracks = await Track.findAll({
      where: condition,
      offset: offset,
      limit: limit,
      include: [{ model: Album, include: [{ model: Artist }] }],
    });

    // Serialize the tracks
    const serializedTracks = tracks.map((album) => album.toJSON());

    parentPort.postMessage(serializedTracks); // Send the tracks to the parent thread
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
};

// This function will be executed when the worker thread starts
await fetchTracks();
