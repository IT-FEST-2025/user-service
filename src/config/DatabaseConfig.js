import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";

export const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20,
};

export const dbPool = new Pool(dbConfig);
