import express from "express";
import * as AuthService from "../service/UserService.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  let response = await AuthService.registerNewUser(req);
  res.json(response);
});

export { router };
