"use strict";

import { getAlbums, postAlbums } from "../controllers/index.js";

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
  ],
};
