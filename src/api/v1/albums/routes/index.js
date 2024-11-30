"use strict";

import { getAlbums, postAlbums, deleteAlbums } from "../controllers/index.js";

export default {
  routes: [
    {
      method: "get",
      path: "/albums",
      action: getAlbums,
    },
    {
      method: "post",
      path: "/albums",
      action: postAlbums,
    },
    {
      method: "delete",
      path: "/albums",
      action: deleteAlbums,
    },
  ],
};
