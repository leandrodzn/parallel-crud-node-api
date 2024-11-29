"use strict";

import { getTracks } from "../controllers/index.js";

export default {
  routes: [
    {
      method: "get",
      path: "/tracks",
      action: getTracks,
    },
  ],
};
