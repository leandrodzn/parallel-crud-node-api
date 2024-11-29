import { Worker } from "node:worker_threads"; // Import the Worker class from the worker_threads module
import connection from "../../../../models/index.js";

const { Track } = connection;

export const getTracks = async (req, res) => {
  try {
    const { num_workers } = req.query;

    const count = await Track.count();

    const numWorkers = parseInt(num_workers, 10) || 1;

    const condition = {}; // Define the condition to filter the tracks

    const limit = Math.ceil(count / numWorkers); // Divide the tracks between the workers

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
    const allTracks = results.flat();

    res.status(200).json(allTracks);
  } catch (error) {
    console.timeEnd("totalTime"); // Stop the timer
    res.status(500).json({ msg: "Error loading tracks", error });
  }
};
