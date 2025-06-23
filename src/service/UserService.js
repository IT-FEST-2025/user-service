import User from "../model/UserModel.js";
import * as Repo from "../repository/Repo.js";
import { SuccessResponse, ErrorResponse } from "../model/ResponseModel.js";
import bcrypt from "bcrypt";

async function registerNewUser(req) {
  //nerima req.body yang nantinya diolah
  const { email, password, fullName, username } = req.body;

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

export { registerNewUser };
