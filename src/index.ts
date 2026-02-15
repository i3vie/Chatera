import prisma from "./util/global_prisma_instance";
import "dotenv/config";
import express from "express";
import { readFileSync } from "node:fs";
import path from "node:path";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./generated/routes";

const app = express();
const port = 36711;

const isDev = process.env.NODE_ENV !== "production";

app.use(express.json());
RegisterRoutes(app);

const openapiSpec = JSON.parse(
    readFileSync(path.join(__dirname, "openapi.json"), "utf8")
);

app.get("/docs.json", (_req, res) => {
    res.json(openapiSpec);
});

if (isDev) {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
} else {
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec, { // disable TIO for prod
        swaggerOptions: {
            tryItOutEnabled: false,
            supportedSubmitMethods: [],
        }
    }));
}

app.listen(port, () => {
    console.log(`Chatera server listening on ${port}`);
});

void prisma;
