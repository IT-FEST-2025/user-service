import { Pool } from "pg";
import { dbConfig, dbPool } from "../config/DatabaseConfig.js";

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

async function getAllUserData(StringUsername) {
  //dipake buat login
  const sqlQuery = `
  SELECT *
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

async function updateUserDataField(id, fieldObject) {
  const allowedFields = [
    "age",
    "gender",
    "height_cm",
    "weight_kg",
    "chronic_diseases",
    "smoking_status",
  ];

  const keys = Object.keys(fieldObject).filter((key) =>
    allowedFields.includes(key)
  );

  if (keys.length === 0) {
    throw new Error("Tidak ada field yang valid untuk diupdate");
  }

  const setClauses = keys.map((key, i) => `${key} = $${i + 1}`);
  const values = keys.map((key) => {
    let val = fieldObject[key];
    if (key === "chronic_diseases") {
      val = JSON.stringify(val);
    }
    return val;
  });

  const sql = `
    UPDATE users
    SET ${setClauses.join(", ")}
    WHERE id = $${keys.length + 1}
    RETURNING ${keys.join(", ")};
  `;

  try {
    const result = await dbPool.query(sql, [...values, id]);

    return result.rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function setImageProfile(filename, userId) {
  const query = `
  UPDATE users
  SET profilepicture = $1
  WHERE id = $2
  RETURNING profilepicture;
`;

  const values = [filename, userId];

  try {
    const result = await dbPool.query(query, values);
    return result.rows[0]; // atau .rowCount untuk jumlah row yang kena
  } catch (err) {
    console.error("Error updating profile:", err);
    throw err;
  }
}

export {
  addUser,
  getAllUserData,
  setResetToken,
  findValidResetToken,
  setTempTokenPw,
  updatePassword,
  updateUserDataField,
  setImageProfile,
};
