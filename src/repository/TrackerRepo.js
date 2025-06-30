import { dbPool } from "../config/DatabaseConfig.js";

async function getHealthRecords(userId, range = "7d") {
  let query = `SELECT * FROM health_records WHERE user_id = $1`;
  const values = [userId];

  if (range === "today") {
    query += ` AND record_date = CURRENT_DATE`;
  } else if (range === "7d" || range === "30d") {
    // Ambil angka dari string, misalnya "7d" → 7
    const days = parseInt(range);
    query += ` AND record_date >= CURRENT_DATE - INTERVAL '${days} days'`;
  } else {
    // fallback ke default 7 hari
    query += ` AND record_date >= CURRENT_DATE - INTERVAL '7 days'`;
  }

  query += ` ORDER BY record_date DESC`;

  try {
    const result = await dbPool.query(query, values);
    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export { getHealthRecords };
