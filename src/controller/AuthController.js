import express from "express";
import * as AuthService from "../service/UserService.js";
import { verifyTokenAsync } from "../middleware/TokenAuthMiddleware.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  let response = await AuthService.registerNewUser(req);
  res.status(Number(response.statusCode)).json(response);
});

router.post("/login", async (req, res) => {
  let response = await AuthService.loginExistingUser(req);
  res.status(Number(response.statusCode)).json(response);
});

router.post("/forgot-password", async (req, res) => {
  const response = await AuthService.forgotPassword(req);
  res.status(Number(response.statusCode)).json(response);
});

router.post("/verify-reset-code", async (req, res) => {
  const response = await AuthService.verifyResetToken(req);
  res.status(Number(response.statusCode)).json(response);
});

router.post("/update-password", async (req, res) => {
  const response = await AuthService.updatePassword(req);
  res.status(Number(response.statusCode)).json(response);
});

router.post("/update/profile", verifyTokenAsync, async (req, res) => {
  const response = await AuthService.updateUserProfile(req);
  res.status(Number(response.statusCode)).json(response);
  // console.log(req.auth);
  // res.json({ masuk: true });
});

export { router };
