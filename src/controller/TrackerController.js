import express from "express";
import { verifyTokenAsync } from "../middleware/TokenAuthMiddleware.js";

const router = express.Router();

router.get("/track", verifyTokenAsync, (req, res) => {
  res.json(req.auth);
});

export { router };
