import { ErrorResponse } from "../model/ResponseModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

async function verifyTokenAsync(req, res, next) {
  let errorResponse = null;
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      errorResponse = new ErrorResponse({
        status: "unauthorized",
        message:
          "Harap lakukan login terlebih dahulu sebelum mengakses fitur ini",
        error: null,
        statusCode: 401,
      });
      return res.status(Number(errorResponse.statusCode)).json(errorResponse);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      errorResponse = new ErrorResponse({
        status: "unauthorized",
        message:
          "Harap lakukan login terlebih dahulu sebelum mengakses fitur ini",
        error: null,
        statusCode: 401,
      });
      return res.status(Number(errorResponse.statusCode)).json(errorResponse);
    }

    // Promise-based verification
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    req.auth = decoded;
    console.log(req.auth);

    next();
  } catch (error) {
    console.log(error);
    let statusCode = 403;
    let message = "Token tidak valid";

    if (error.name === "TokenExpiredError") {
      statusCode = 401;
      message = "Token telah kedaluwarsa";
    } else if (error.name === "JsonWebTokenError") {
      message = "Token tidak valid";
    } else if (error.name === "NotBeforeError") {
      message = "Token belum aktif";
    }

    errorResponse = new ErrorResponse({
      status: "unatuhorized",
      message,
      error: null,
      statusCode,
    });
    return res.status(statusCode).json(errorResponse);
  }
}

export { verifyTokenAsync };
