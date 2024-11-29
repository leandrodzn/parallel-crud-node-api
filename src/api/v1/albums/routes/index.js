"use strict";

import { getAlbums } from "../controllers/index.js";
import { postAlbums } from "../controllers/index.js";  // Asegúrate de importar el nuevo controlador

export default {
  routes: [
    {
      method: "get",
      path: "/albums",
      action: getAlbums,
    },
    {
      method: "post",  // Nuevo método para crear álbumes
      path: "/albums",  // La ruta será la misma, pero el método es POST
      action: postAlbums,  // Acciona el método createAlbums
    },
  ],
};