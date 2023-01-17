import express, { json } from "express";
import userRouter from "./routes/user.router.js";
import cors from "cors";
import { errorHandler } from "./errors/error.js";
import cookieParser from "cookie-parser";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

const app = express();
app
.use(cookieParser())
  .use(json())
  .use(cors())
  //   .use("/uploads", express.static(path.join(__dirname, ".", "uploads")))

  .use("/api/v1/users", userRouter)
  .use(errorHandler);

export default app;
