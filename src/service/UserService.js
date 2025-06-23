import User from "../model/UserModel.js";
import * as Repo from "../repository/Repo.js";
import { SuccessResponse, ErrorResponse } from "../model/ResponseModel.js";
import bcrypt from "bcrypt";
import {
  userRegisterSchema,
  userLoginSchema,
} from "../model/ValidationModel.js";

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
    });
  } catch (error) {
    return new ErrorResponse({
      status: "error",
      message: "terjadi kesalahan saat registrasi",
      error: [error.detail, error.constraint],
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
    });
  }

  const userData = await Repo.getSimpleData(username);

  if (!userData) {
    return new ErrorResponse({
      status: "bad request",
      message: "akun tidak ditemukan!",
      error: null,
    });
  }

  const isMatch = await bcrypt.compare(password, userData.password_hash);

  if (!isMatch) {
    return new ErrorResponse({
      status: "bad request",
      message: "password salah",
      error: null,
    });
  }

  return new SuccessResponse({
    status: "success",
    message: "berhasil login",
    data: {
      accessToken: "ini rahasia",
    },
  });
}

export { registerNewUser, loginExistingUser };
