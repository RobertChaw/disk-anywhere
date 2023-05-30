import { createConfiguration, hooks } from "@midwayjs/hooks";
import * as Koa from "@midwayjs/koa";
import * as cos from "@midwayjs/cos";
import dotenv from "dotenv";

dotenv.config();

/**
 * setup midway server
 */
export default createConfiguration({
  imports: [Koa, hooks(), cos],
  importConfigs: [
    {
      default: {
        keys: "bf21a14d8b0eb60f8b95ae0df61162b8",
        cos: {
          client: {
            SecretId: process.env.COS_SECRET_ID,
            SecretKey: process.env.COS_SECRET_KEY,
          },
        },
      },
    },
  ],
});
