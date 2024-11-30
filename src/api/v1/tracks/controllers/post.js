import { parentPort, workerData } from "node:worker_threads";
import connection from "../../../../models/index.js";

const { Track, Album, MediaType, Genre } = connection;

const processTracks = async (tracks) => {
  const results = [];

  for (const track of tracks) {
    const { Name, AlbumId, MediaTypeId, GenreId, Composer, Milliseconds, Bytes, UnitPrice } = track;

    try {
      // Verify AlbumId
      const album = await Album.findByPk(AlbumId);
      if (!album) {
        results.push({
          error: `Album with ID ${AlbumId} does not exist.`,
          track,
        });
        continue;
      }

      // Verify MediaTypeId
      const mediaType = await MediaType.findByPk(MediaTypeId);
      if (!mediaType) {
        results.push({
          error: `MediaType with ID ${MediaTypeId} does not exist.`,
          track,
        });
        continue;
      }

      // Verify GenreId (if provided)
      if (GenreId) {
        const genre = await Genre.findByPk(GenreId);
        if (!genre) {
          results.push({
            error: `Genre with ID ${GenreId} does not exist.`,
            track,
          });
          continue;
        }
      }

      // Create the track
      const newTrack = await Track.create({
        Name,
        AlbumId,
        MediaTypeId,
        GenreId,
        Composer,
        Milliseconds,
        Bytes,
        UnitPrice,
      });

      results.push(newTrack.toJSON());
    } catch (err) {
      results.push({
        error: `Failed to process track: ${err.message}`,
        track,
      });
    }
  }

  return results;
};

(async () => {
  const { chunk } = workerData;

  const results = await processTracks(chunk);

  parentPort.postMessage(results);
})();