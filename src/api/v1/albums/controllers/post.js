import { parentPort, workerData } from "node:worker_threads";
import connection from "../../../../models/index.js";

const { Album, Artist } = connection;

const processAlbums = async (albums) => {
  try {
    const results = [];

    for (const { Title, ArtistId } of albums) {
      // Verifica si el artista existe
      const artist = await Artist.findByPk(ArtistId);

      // Si el artista no existe, agrega un mensaje de error
      if (!artist) {
        results.push({
          error: `El artista del álbum "${Title}" no existe`,
          Title,
          ArtistId
        });
        continue; // Salta a la siguiente iteración
      }

      // Crea el álbum asociado al artista
      const album = await Album.create({
        Title,
        ArtistId,
      });

      results.push(album.toJSON()); // Serializa el álbum para enviar al hilo principal
    }

    parentPort.postMessage(results); // Devuelve los resultados al hilo principal
  } catch (error) {
    parentPort.postMessage({ error: error.message });
  }
};

// Ejecuta el procesamiento
await processAlbums(workerData);