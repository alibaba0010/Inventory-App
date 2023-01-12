import express, { json } from "express";

// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
app.use(json());
//   .use("/uploads", express.static(path.join(__dirname, ".", "uploads")))

//   .use(routeError)
//   .use(errorHandler);

export default app;
