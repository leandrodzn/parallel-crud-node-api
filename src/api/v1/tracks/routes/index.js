"use strict";

import { getTracks, deleteTracks, postTracks } from "../controllers/index.js";

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
    {
      method: "post",
      path: "/tracks",
      action: postTracks,
    },
  ],
};
