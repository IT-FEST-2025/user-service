import express from "express";
import * as AuthService from "../service/UserService.js";
import { verifyTokenAsync } from "../middleware/TokenAuthMiddleware.js";

const router = express.Router();

const handleServiceResponse = async (serviceMethod, req, res) => {
  const response = await serviceMethod(req);
  return res.status(response.statusCode).json(response);
};

// Auth routes
router.post("/register", (req, res) =>
  handleServiceResponse(AuthService.registerNewUser, req, res)
);

router.post("/login", (req, res) =>
  handleServiceResponse(AuthService.loginExistingUser, req, res)
);

router.post("/forgot-password", (req, res) =>
  handleServiceResponse(AuthService.forgotPassword, req, res)
);

router.post("/verify-reset-code", (req, res) =>
  handleServiceResponse(AuthService.verifyResetToken, req, res)
);

router.post("/update-password", (req, res) =>
  handleServiceResponse(AuthService.updatePassword, req, res)
);

router.post("/update/profile", verifyTokenAsync, (req, res) =>
  handleServiceResponse(AuthService.updateUserProfile, req, res)
);

router.get("/me", verifyTokenAsync, (req, res) =>
  handleServiceResponse(AuthService.getMyData, req, res)
);

export { router };
