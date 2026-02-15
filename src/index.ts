import prisma from "./util/global_prisma_instance";
import "dotenv/config";
import express from "express";
import { readFileSync } from "node:fs";
import path from "node:path";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./generated/routes";

const app = express();
const port = 36711;

app.use(express.json());
RegisterRoutes(app);

const openapiSpec = JSON.parse(
  readFileSync(path.join(__dirname, "openapi.json"), "utf8")
);

app.get("/docs.json", (_req, res) => {
  res.json(openapiSpec);
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.listen(port, () => {
  console.log(`Chatera server listening on ${port}`);
});

void prisma;
