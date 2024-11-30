import os from "node:os"; // Module for interacting with the operating system

// Calculate the number of workers based on the number of CPU cores
export const calculateNumWorkers = (numWorkers, dataLength) => {
  try {
    const numCores = os.cpus().length; // Get the number of CPU cores

    let numWorkersReceived = parseInt(numWorkers || 0, 10); // Parse the number of workers received

    if (numWorkersReceived > 0) {
      return numWorkersReceived; // Return the number of workers received
    }

    const numWorkersCalculated = Math.min(numCores, dataLength || 1); // Calculate the number of workers
    return numWorkersCalculated;
  } catch (error) {
    return 1; // Return 1 worker by default
  }
};
