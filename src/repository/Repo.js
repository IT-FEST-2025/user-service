import { Pool } from "pg";
import { dbConfig } from "../config/DatabaseConfig.js";

const dbPool = new Pool(dbConfig);

async function addUser(newUser) {
  const sqlString = `
    INSERT INTO users (
      email,
      password_hash,
      full_name,
      username
    ) VALUES ($1, $2, $3, $4)
    RETURNING created_at, username;
  `;

  const values = [
    newUser.email,
    newUser.passwordHash,
    newUser.fullName,
    newUser.username,
  ];

  try {
    const result = await dbPool.query(sqlString, values);
    return result.rows[0];
  } catch (err) {
    console.error("Gagal insert user:", err.message);
    console.log(err);
    throw err;
  }
}

async function getSimpleData(StringUsername) {
  //dipake buat login
  const sqlQuery = `
  SELECT
    id,
    email,
    password_hash,
    full_name,
    username,
    created_at
  FROM users
  WHERE username = $1
`;

  const values = [StringUsername];
  try {
    const result = await dbPool.query(sqlQuery, values);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function setResetToken(email, code, expTime) {
  const query = `
    INSERT INTO reset_password (email, token, expires_at)
    VALUES ($1, $2, $3);
  `;

  const values = [email, code, expTime];

  try {
    const result = await dbPool.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function setTempTokenPw(StringToken, email) {
  const sqlString = `UPDATE reset_password
  SET temp_token = $1
  WHERE email = $2 AND is_used = false;`;

  const values = [StringToken, email];

  try {
    const result = await dbPool.query(sqlString, values);
    return result.rows[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function findValidResetToken(token, email) {
  const query = `
    SELECT * FROM reset_password
    WHERE token = $1
      AND email = $2
      AND is_used = false
      AND expires_at > NOW()
    LIMIT 1;
  `;
  try {
    const result = await dbPool.query(query, [token, email]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getTokenResetData(tempToken) {
  const sqlString = `SELECT *
  FROM reset_password
  WHERE temp_token = $1
  AND is_used = false
  AND expires_at > NOW();`;

  try {
    const result = await dbPool.query(sqlString, [tempToken]);
    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function updatePassword(tempToken, hashNewPassword) {
  let userData = null;

  try {
    userData = await getTokenResetData(tempToken);

    if (!userData) {
      const error = new Error("token tidak ditemukan!");
      throw error;
    }
  } catch (error) {
    throw error;
  }

  const sqlString = `UPDATE users
  SET password_hash = $1
  WHERE email = $2;`;

  const updatePwTableTrue = `
    UPDATE reset_password
    SET is_used = true
    WHERE temp_token = $1
      AND is_used = false
      AND expires_at > NOW()
    RETURNING *;
  `;

  try {
    const result = await dbPool.query(sqlString, [
      hashNewPassword,
      userData.email,
    ]);

    const updateResetUsed = await dbPool.query(updatePwTableTrue, [tempToken]);
    return;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// async function dynamicDbColumnUpdate() {
//   //field yg boleh diupdate
//   const allowedFields = [
//     "full_name",
//     "username",
//     "age",
//     "gender",
//     "height_cm",
//     "weight_kg",
//     "chronic_diseases",
//     "smoking_status",
//   ];
// }

export {
  addUser,
  getSimpleData,
  setResetToken,
  findValidResetToken,
  setTempTokenPw,
  updatePassword,
};
