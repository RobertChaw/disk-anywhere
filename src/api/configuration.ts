import { createConfiguration, hooks } from "@midwayjs/hooks";
import * as Koa from "@midwayjs/koa";
import * as upload from "@midwayjs/upload";
import dotenv from "dotenv";

dotenv.config();

/**
 * setup midway server
 */
export default createConfiguration({
  imports: [Koa, hooks(), upload],
  importConfigs: [
    {
      default: {
        keys: "bf21a14d8b0eb60f8b95ae0df61162b8",
        upload: {
          fileSize: "15mb",
          whitelist: null,
        },
      },
    },
  ],
});
