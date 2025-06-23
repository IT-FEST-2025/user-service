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
    console.log(result.rows);
    return result.rows[0];
  } catch (err) {
    console.error("Gagal insert user:", err.message);
    console.log(err);
    throw err;
  }
}

export { addUser };
