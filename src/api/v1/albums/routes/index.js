"use strict";

import { getAlbums } from "../controllers/index.js";

export default {
  routes: [
    {
      method: "get",
      path: "/albums",
      action: getAlbums,
    },
  ],
};
