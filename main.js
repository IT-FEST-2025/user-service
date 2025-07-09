import express from "express";
import * as AuthController from "./src/controller/AuthController.js";
import * as TrackerController from "./src/controller/TrackerController.js";
import { uploadDir } from "./src/model/MulterModel.js";
import cors from "cors";
const app = express();

middleware;
app.use(
  cors({
    origin: ["https://ayuwoki.my.id", "http://localhost:5173"],
  })
);
app.use(express.json());

//routing
app.use("/api", AuthController.router);
app.use("/tracker", TrackerController.router);

app.use("/uploads", express.static(uploadDir));

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`app berjalan di port ${PORT}`);
});
