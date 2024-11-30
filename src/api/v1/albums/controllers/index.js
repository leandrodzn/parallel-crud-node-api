import connection from "../../../../models/index.js";
import { calculateNumWorkers } from "../../../../utils/index.js";
import os from "node:os"; // Module for interacting with the operating system
import { Worker } from "node:worker_threads"; // Import the Worker class from the worker_threads module

const { Album } = connection;

export const getAlbums = async (req, res) => {
  try {
    const { num_workers } = req.query;

    const count = await Album.count();

    const numWorkers = calculateNumWorkers(num_workers);

    const condition = {}; // Define the condition to filter the albums

    const limit = Math.ceil(count / numWorkers); // Divide the albums between the workers

    console.log(
      `Using ${numWorkers} worker(s) from ${os.cpus().length} CPU(s) available`
    );

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

    res.status(200).json({
      workers: numWorkers,
      message: "Albums fetched successfully.",
      albums: allAlbums,
    });
  } catch (error) {
    console.timeEnd("totalTime"); // Stop the timer
    res.status(500).json({ msg: "Error loading albums", error });
  }
};

export const postAlbums = async (req, res) => {
  try {
    const { albums, num_workers } = req.body; // `albums` is an objects array with Title y ArtistId

    if (!Array.isArray(albums) || albums.length === 0) {
      return res.status(400).json({ message: "No albums provided." });
    }

    const numWorkers = calculateNumWorkers(num_workers, albums.length);

    console.log(
      `Using ${numWorkers} worker(s) from ${os.cpus().length} CPU(s) available`
    );

    console.time("totalTime"); // Start the total time

    // Divide albums into chunks
    const chunkSize = Math.ceil(albums.length / numWorkers);
    const chunks = Array.from({ length: numWorkers }, (_, i) =>
      albums.slice(i * chunkSize, (i + 1) * chunkSize)
    );

    // Create a worker for each chunk
    const workers = chunks.map(
      (chunk, i) =>
        new Promise((resolve, reject) => {
          const workerUrl = new URL("./post.js", import.meta.url);

          const worker = new Worker(workerUrl, {
            workerData: chunk, // Pasa cada chunk al worker
          });

          worker.on("message", (data) => {
            console.log(`Worker ${i + 1} finished!`);
            resolve(data); // Return the data
          });
          worker.on("error", (err) => reject(err));
          worker.on("exit", (code) => {
            if (code !== 0)
              reject(new Error(`Worker exited with code ${code}`));
          });
        })
    );

    // Wait for all workers to finish
    const results = await Promise.all(workers);

    console.timeEnd("totalTime"); // Finish the total time

    // Flatten the results if they are arrays
    const insertedAlbums = results.flat();

    res.status(201).json({
      workers: numWorkers,
      message: "Albums processed successfully.",
      albums: insertedAlbums,
    });
  } catch (error) {
    console.timeEnd("totalTime");
    res.status(500).json({
      message: "Error processing albums.",
      error: error.message,
    });
  }
};

export const deleteAlbums = async (req, res) => {
  try {
    const { num_workers, ids } = req.body;

    const numWorkers = calculateNumWorkers(num_workers);

    console.log(
      `Using ${numWorkers} worker(s) from ${os.cpus().length} CPU(s) available`
    );

    const chunkSize = Math.ceil(ids.length / numWorkers);

    const workers = Array.from(
      { length: numWorkers }, // Create an array with the number of workers
      (_, i) =>
        // Create a new promise for each worker
        new Promise((resolve, reject) => {
          const chunk = ids.slice(i * chunkSize, (i + 1) * chunkSize);

          // Create a new worker
          const workerUrl = new URL("./delete.js", import.meta.url);

          const worker = new Worker(workerUrl, {
            workerData: {
              chunk,
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

    res.status(200).json({
      message: "All deletions completed successfully.",
      results,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting albums.",
      error: error.message,
    });
  }
};
