import User from "../model/UserModel.js";
import * as Repo from "../repository/Repo.js";
import { SuccessResponse, ErrorResponse } from "../model/ResponseModel.js";
import bcrypt from "bcrypt";
import {
  userRegisterSchema,
  userLoginSchema,
} from "../model/ValidationModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

//global var
const jwtSecret = process.env.JWT_SECRET;

function validateUser(userObject) {
  const { error } = userRegisterSchema.validate(userObject, {
    abortEarly: false,
  });
  return error;
}

function validateLoginUser(loginObject) {
  const { error } = userLoginSchema.validate(loginObject, {
    abortEarly: false,
  });
  return error;
}

async function registerNewUser(req) {
  //nerima req.body yang nantinya diolah
  const { email, password, fullName, username } = req.body;

  let isNotValid = validateUser({ email, password, fullName, username });

  if (isNotValid) {
    const errorDetails = isNotValid.details.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));

    return new ErrorResponse({
      status: "bad request",
      message: "data tidak valid",
      error: errorDetails,
      stausCode: 400,
    });
  }

  let passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    passwordHash,
    fullName,
    username,
  });

  try {
    let resData = await Repo.addUser(user);
    return new SuccessResponse({
      status: "success",
      message: "berhasil registrasi! harap login",
      data: resData,
      statusCode: 200,
    });
  } catch (error) {
    return new ErrorResponse({
      status: "error",
      message: "terjadi kesalahan saat registrasi",
      error: [error.detail, error.constraint],
      statusCode: 400,
    });
  }
}

async function loginExistingUser(loginObjectBody) {
  const { username, password } = loginObjectBody.body;

  const isNotValid = validateLoginUser({ username, password });
  if (isNotValid) {
    const errorDetails = isNotValid.details.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));

    return new ErrorResponse({
      status: "bad request",
      message: "data tidak valid",
      error: errorDetails,
      stausCode: 400,
    });
  }

  const userData = await Repo.getSimpleData(username);
  // console.log(userData);

  if (!userData) {
    return new ErrorResponse({
      status: "bad request",
      message: "akun tidak ditemukan!",
      error: null,
      statusCode: 400,
    });
  }

  const isMatch = await bcrypt.compare(password, userData.password_hash);

  if (!isMatch) {
    return new ErrorResponse({
      status: "bad request",
      message: "password salah",
      error: null,
      statusCode: 401,
    });
  }

  const token = jwt.sign(
    {
      id: userData.id,
      username: userData.username,
      timeStamp: Date.now(),
    },
    jwtSecret,
    {
      expiresIn: "72h",
    }
  );

  return new SuccessResponse({
    status: "success",
    message: "berhasil login",
    data: {
      accessToken: token,
    },
    statusCode: 200,
  });
}

export { registerNewUser, loginExistingUser };
