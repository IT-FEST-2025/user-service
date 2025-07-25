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

async function addHealthRecord(recordObj) {
  const sqlString = `
    INSERT INTO health_records (
      user_id,
      exercise_minutes,
      exercise_type,
      sleep_hours,
      water_glasses,
      junk_food_count,
      overall_mood,
      stress_level,
      screen_time_hours,
      blood_pressure
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10
    ) RETURNING *;
  `;

  const values = [
    recordObj.user_id,
    recordObj.exercise_minutes,
    recordObj.exercise_type,
    recordObj.sleep_hours,
    recordObj.water_glasses,
    recordObj.junk_food_count,
    recordObj.overall_mood,
    recordObj.stress_level,
    recordObj.screen_time_hours,
    recordObj.blood_pressure,
  ];

  try {
    const result = await dbPool.query(sqlString, values);
    console.log(result);
    return result.rows[0];
  } catch (err) {
    // console.log("Error code:", err.code);
    // console.log("Error message:", err.message);
    // console.log("Full error:", err);
    if (err.code === "23514") {
      const customErr = new Error("gagal saat menulis data ke db!");

      customErr.reason =
        "Data yang kamu masukkan tidak sesuai ketentuan! Harap masukkan data secara sesuai dan masuk akal!";
      throw customErr;
    }
    console.error("Gagal insert record:", err.message);
    throw err;
  }
}

export { getHealthRecords, addHealthRecord };
