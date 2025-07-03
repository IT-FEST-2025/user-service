import express from "express";
import * as AuthController from "./src/controller/AuthController.js";
import * as TrackerController from "./src/controller/TrackerController.js";
const app = express();

//middleware
app.use(express.json());

//routing
app.use("/api", AuthController.router);
app.use("/tracker", TrackerController.router);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`app berjalan di port ${PORT}`);
});
