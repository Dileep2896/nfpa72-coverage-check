import express from "express";
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import { InMemoryDeviceRepository } from "./repo/in-memory-repository.js";
import { MockLayoutProvider } from "./providers/mock-layout-provider.js";
import type { DeviceRepository } from "./repo/device-repository.js";
import { sheetsRouter } from "./routes/sheets.js";
export function createApp(
  repo: DeviceRepository = new InMemoryDeviceRepository(),
) {
  const app = express();
  app.disable("x-powered-by");
  app.use(express.json({ limit: "100kb" }));
  app.use("/api/sheets", sheetsRouter(new MockLayoutProvider(), repo));
  app.use("/api", (_req, res) =>
    res.status(404).json({ error: "API route not found" }),
  );
  const publicDir = path.resolve("dist");
  if (existsSync(publicDir)) {
    app.use(express.static(publicDir));
    app.get("*", (_req, res) =>
      res.sendFile(path.join(publicDir, "index.html")),
    );
  }
  const errors: ErrorRequestHandler = (error, _req, res, _next) => {
    const invalid = error instanceof ZodError || error instanceof SyntaxError;
    res
      .status(invalid ? 400 : 500)
      .json({
        error: invalid
          ? "Invalid request body"
          : "Unable to complete this operation",
      });
  };
  app.use(errors);
  return app;
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href
) {
  const port = Number(process.env.PORT ?? 4000);
  createApp().listen(port, "127.0.0.1", () =>
    console.log(`Coverage Check API ready at http://127.0.0.1:${port}`),
  );
}
