import connection from "../../../../models/index.js";
const { Album, Artist } = connection;

import { Worker } from "worker_threads";

export const getAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll({
      include: [
        {
          model: Artist,
        },
      ],
    });
    res.status(200).json(albums);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Error loading albums", error });
  }
};
