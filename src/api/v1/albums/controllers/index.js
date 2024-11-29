import { Worker } from "node:worker_threads"; // Import the Worker class from the worker_threads module
import connection from "../../../../models/index.js";

const { Album } = connection;

export const getAlbums = async (req, res) => {
  try {
    const { num_workers } = req.query;

    const count = await Album.count();

    const numWorkers = num_workers;

    const condition = {}; // Define the condition to filter the albums

    const limit = Math.ceil(count / numWorkers); // Divide the albums between the workers

    console.time("totalTime"); // Start the timer

    const workers = Array.from(
      { length: numWorkers }, // Create an array with the number of workers
      (_, i) =>
        // Create a new promise for each worker
        new Promise((resolve, reject) => {
          const offset = Math.ceil((count / numWorkers) * i); // Calculate offset for each worker

          // Create a new worker
          const workerUrl = new URL("./get.js", import.meta.url);

          const worker = new Worker(workerUrl, {
            workerData: {
              offset,
              limit,
              condition,
            },
          });

          worker.on("message", (data) => {
            console.log(`Worker ${i + 1} finished!`);
            resolve(data); // Resolves the promise with the data
          });
          worker.on("error", (err) => reject(err)); // Error handling
          worker.on("exit", (code) => {
            if (code !== 0)
              reject(new Error(`Worker exited with code ${code}`));
          });
        })
    );

    // Wait for all workers to finish
    const results = await Promise.all(workers);

    console.timeEnd("totalTime"); // Stop the timer

    // Use flat to flatten the results if they are arrays
    const allAlbums = results.flat();

    res.status(200).json(allAlbums);
  } catch (error) {
    console.timeEnd("totalTime"); // Stop the timer
    res.status(500).json({ msg: "Error loading albums", error });
  }
};
