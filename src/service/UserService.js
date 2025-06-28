import User from "../model/UserModel.js";
import * as Repo from "../repository/Repo.js";
import { SuccessResponse, ErrorResponse } from "../model/ResponseModel.js";
import bcrypt from "bcrypt";
import {
  userRegisterSchema,
  userLoginSchema,
  updateUserSchema,
} from "../model/ValidationModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { transporter } from "../model/EmailTransporterModel.js";
import crypto from "crypto";

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

  const userData = await Repo.getAllUserData(username);
  console.log(userData);

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

async function forgotPassword(req) {
  const { username } = req.body;

  const userData = await Repo.getAllUserData(username);

  if (!userData) {
    return new ErrorResponse({
      status: "NOT FOUND",
      message: "username tidak ditemukan",
      error: null,
      statusCode: 404,
    });
  }

  const userEmail = userData.email;
  const resetPwToken = Math.floor(100000 + Math.random() * 900000).toString();
  const expDate = new Date(Date.now() + 15 * 60 * 1000);

  try {
    await Repo.setResetToken(userEmail, resetPwToken, expDate);

    const mailOptions = {
      from: "agmerramadhan@gmail.com",
      to: userEmail,
      subject: "reset code password diagnify",
      text: `BERIKUT ADALAH KODE UNTUK RESET PASSWORD AKUN DIAGNIFY MU ${resetPwToken}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });

    return new SuccessResponse({
      status: "success",
      message: "kode sudah dikirimkan ke email",
      data: {
        email: userEmail,
      },
      statusCode: 200,
    });
  } catch (error) {
    return new ErrorResponse({
      status: "error",
      message: "terjadi kesalahan internal di server",
      error: [error.detail],
      statusCode: 500,
    });
  }
}

async function verifyResetToken(req) {
  const { email, resetCode } = req.body;

  let isResetCodeValid = null;

  try {
    isResetCodeValid = await Repo.findValidResetToken(resetCode, email);
  } catch (error) {
    return new ErrorResponse({
      status: "error",
      message: "terjadai kesalahan di server!",
      error: null,
      statusCode: 500,
    });
  }

  if (!isResetCodeValid) {
    return new ErrorResponse({
      status: "error",
      message: "Kode sudah expire atau tidak ditemukan!",
      error: null,
      statusCode: 400,
    });
  }

  const tempCode = crypto.randomBytes(16).toString("hex");
  console.log(isResetCodeValid);

  try {
    await Repo.setTempTokenPw(tempCode, email);
    return new SuccessResponse({
      status: "success",
      message: "berhasil memverifikasi kode reset token",
      data: {
        tempToken: tempCode,
      },
      statusCode: 200,
    });
  } catch (error) {
    return new ErrorResponse({
      status: "error",
      message: "terjadai kesalahan di server!",
      error: [error.details],
      statusCode: 500,
    });
  }
}

async function updatePassword(req) {
  const { tempToken, newPassword } = req.body;

  const hashedPw = await bcrypt.hash(newPassword, 10);

  if (!tempToken || !newPassword) {
    return new ErrorResponse({
      status: "BAD REQUEST",
      message:
        "Token atau password baru tidak valid! harap masukan data secara benar!",
      error: null,
      statusCode: 400,
    });
  }

  try {
    await Repo.updatePassword(tempToken, hashedPw);
    return new SuccessResponse({
      status: "success",
      message: "mengupdate password",
      data: null,
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    return new ErrorResponse({
      status: "error",
      message: "terjadi kesalahan saat mengganti password! operasi dibatalkan",
      error: [error],
      statusCode: 500,
    });
  }
}

async function updateUserProfile(req) {
  const { updateFields } = req.body;
  const { error, value } = updateUserSchema.validate(updateFields, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return new ErrorResponse({
      status: "error",
      message: "Validasi gagal",
      error: error.details.map((e) => ({
        field: e.path[0],
        message: e.message,
      })),
      statusCode: 400,
    });
  }

  console.log(req.auth.id);
  try {
    await Repo.updateUserDataField(req.auth.id, updateFields);

    return new SuccessResponse({
      status: "success",
      message: "berhasil mengupdate fields",
      data: updateFields,
      statusCode: 200,
    });
  } catch (error) {
    return new ErrorResponse({
      status: "error",
      message: "terjadi kesalahan saat mengganti password! operasi dibatalkan",
      error: [error],
      statusCode: 500,
    });
  }
}

async function getMyData(req) {
  const username = req.auth.username;

  try {
    const userRawData = await Repo.getAllUserData(username);

    if (!userRawData) {
      return new ErrorResponse({
        status: "bad request",
        message: "akun tidak ditemukan!",
        error: null,
        statusCode: 400,
      });
    }

    const responseData = {
      email: userRawData.email,
      username: userRawData.username,
      fullName: userRawData.full_name,
      age: userRawData.age,
      gender: userRawData.gender,
      height: userRawData.height_cm,
      weight: userRawData.weight_kg,
      chronicDiseases: userRawData.chronic_diseases,
      smokingStatus: userRawData.smoking_status,
    };
    return new SuccessResponse({
      status: "success",
      message: "berhasil mengambil data user",
      data: responseData,
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    return new ErrorResponse({
      status: "error",
      message: "terjadi kesalahan saat mengganti password! operasi dibatalkan",
      error: [error],
      statusCode: 500,
    });
  }
}

export {
  registerNewUser,
  loginExistingUser,
  forgotPassword,
  verifyResetToken,
  updatePassword,
  updateUserProfile,
  getMyData,
};
