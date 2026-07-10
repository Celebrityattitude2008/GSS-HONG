import express, { type Express } from "express";
import cors from "cors";
import { pinoHttp } from "pino-http"; // Fixed: Added curly braces to fix TS2349
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      // Fixed: Explicitly typed 'req' to fix TS7006
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      // Fixed: Explicitly typed 'res' to fix TS7006
      res(res: any) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
