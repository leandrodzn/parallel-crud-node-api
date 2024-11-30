import { parentPort, workerData } from "node:worker_threads";
import connection from "../../../../models/index.js";

const { Album, Artist } = connection;

const processAlbums = async (albums) => {
  try {
    const results = [];

    for (const { Title, ArtistId } of albums) {
      // Verify if the artist exists
      const artist = await Artist.findByPk(ArtistId);

      // If the artist does not exist, add an error to the results
      if (!artist) {
        results.push({
          error: `Artist from album "${Title}" not found`,
          Title,
          ArtistId,
        });
        continue; // Skip the rest of the loop
      }

      // Create the album
      const album = await Album.create({
        Title,
        ArtistId,
      });

      results.push(album.toJSON()); // Add the album to the results
    }

    parentPort.postMessage(results); // Send the results to the parent thread
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
};

// Process the albums
await processAlbums(workerData);
