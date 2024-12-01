import { Worker } from "node:worker_threads"; // Import the Worker class from the worker_threads module
import connection from "../../../../models/index.js";
import { calculateNumWorkers } from "../../../../utils/index.js";
import os from "node:os"; // Module for interacting with the operating system
import { performance } from "node:perf_hooks"; // Import the performance module from the perf_hooks module

const { Track } = connection;

export const getTracks = async (req, res) => {
  try {
    const { num_workers } = req.query;

    const count = await Track.count();

    console.log(`Total tracks: ${count}`);

    const numWorkers = calculateNumWorkers(num_workers);

    const condition = {}; // Define the condition to filter the tracks

    const limit = Math.ceil(count / numWorkers); // Divide the tracks between the workers

    console.log(
      `Using ${numWorkers} worker(s) from ${os.cpus().length} CPU(s) available`
    );

    const start = performance.now(); // Start the timer

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

    // Use flat to flatten the results if they are arrays
    const allTracks = results.flat();

    const end = performance.now(); // Stop the timer

    const timeTaken = end - start; // Calculate the total time

    console.log(`Time taken: ${timeTaken} ms`);

    res.status(200).json(allTracks);
  } catch (error) {
    res.status(500).json({ msg: "Error loading tracks", error });
  }
};

export const deleteTracks = async (req, res) => {
  try {
    const { num_workers, ids } = req.body;

    const numWorkers = calculateNumWorkers(num_workers);

    console.log(
      `Using ${numWorkers} worker(s) from ${os.cpus().length} CPU(s) available`
    );

    console.log(`Total tracks: ${ids.length}`);

    const chunkSize = Math.ceil(ids.length / numWorkers);

    const start = performance.now(); // Start the timer

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

    const end = performance.now(); // Stop the timer

    const timeTaken = end - start; // Calculate the total time

    console.log(`Time taken: ${timeTaken} ms`);

    res.status(200).json({
      message: "All deletions completed successfully.",
      results,
    });
  } catch (error) {
    res.status(500).json({
      workers: numWorkers,
      message: "Error deleting tracks.",
      error: error.message,
    });
  }
};

export const postTracks = async (req, res) => {
  try {
    const { tracks, num_workers } = req.body;

    if (!tracks || !Array.isArray(tracks) || tracks.length === 0) {
      return res.status(400).json({ message: "No tracks data provided." });
    }

    console.log(`Total tracks: ${tracks.length}`);

    // Determine the number of workers based on the input or system capabilities
    const numWorkers = calculateNumWorkers(num_workers);

    console.log(
      `Using ${numWorkers} worker(s) from ${os.cpus().length} CPU(s) available`
    );

    const chunkSize = Math.ceil(tracks.length / numWorkers);

    const start = performance.now(); // Start the timer

    // Create workers for parallel processing
    const workers = Array.from(
      { length: numWorkers },
      (_, i) =>
        new Promise((resolve, reject) => {
          const chunk = tracks.slice(i * chunkSize, (i + 1) * chunkSize);

          const workerUrl = new URL("./post.js", import.meta.url);

          const worker = new Worker(workerUrl, {
            workerData: { chunk },
          });

          worker.on("message", (data) => {
            console.log(`Worker ${i + 1} finished!`);
            resolve(data); // Resolve the promise with worker results
          });

          worker.on("error", (err) => reject(err));
          worker.on("exit", (code) => {
            if (code !== 0)
              reject(new Error(`Worker exited with code ${code}`));
          });
        })
    );

    // Wait for all workers to complete
    const results = await Promise.all(workers);

    const end = performance.now(); // Stop the timer

    const timeTaken = end - start; // Calculate the total time

    console.log(`Time taken: ${timeTaken} ms`);

    res.status(200).json({
      message: "Tracks processed successfully.",
      results: results.flat(),
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating tracks.",
      error: error.message,
    });
  }
};
