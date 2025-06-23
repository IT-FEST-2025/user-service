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

export { addUser, getSimpleData };
