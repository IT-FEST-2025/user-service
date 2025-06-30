import express from "express";
import { verifyTokenAsync } from "../middleware/TokenAuthMiddleware.js";
import * as TrackerService from "./../service/TrackerService.js";

const router = express.Router();

const handleServiceResponse = async (serviceMethod, req, res) => {
  const response = await serviceMethod(req);
  return res.status(response.statusCode).json(response);
};

router.get("/", verifyTokenAsync, (req, res) => {
  handleServiceResponse(TrackerService.getUserHealthData, req, res);
});

router.post("/", verifyTokenAsync, (req, res) => {
  handleServiceResponse(TrackerService.addHealthTrackData, req, res);
});

export { router };
