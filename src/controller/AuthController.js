import express from "express";
import * as AuthService from "../service/UserService.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  let response = await AuthService.registerNewUser(req);
  res.status(Number(response.statusCode)).json(response);
});

router.post("/login", async (req, res) => {
  let response = await AuthService.loginExistingUser(req);
  res.status(Number(response.statusCode)).json(response);
});

export { router };
