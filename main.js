import express from "express";
import * as AuthController from "./src/controller/AuthController.js";
const app = express();

//middleware
app.use(express.json());

//routing
app.use("/api", AuthController.router);

app.listen(3000, () => {
  console.log("app berjalan di port 3000");
});
