"use strict";

import { getTracks, deleteTracks } from "../controllers/index.js";

export default {
  routes: [
    {
      method: "get",
      path: "/tracks",
      action: getTracks,
    },
    {
      method: "delete",
      path: "/tracks",
      action: deleteTracks,
    },
  ],
};
