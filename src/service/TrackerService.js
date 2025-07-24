import { SuccessResponse, ErrorResponse } from "../model/ResponseModel.js";
import * as TrackerRepo from "./../repository/TrackerRepo.js";

async function getUserHealthData(req) {
  //nanti service ini bakal return data seminggu ke belakang sama analisis dan saran
  //buat kehidupan user!
  const range = req.query.range;
  const userID = req.auth.id;

  try {
    const healthData = await TrackerRepo.getHealthRecords(userID, range);

    const trendAnalyze = analyzeHealthData(healthData);

    const dailyScore = countEveryDiagnifyScore(healthData);

    return new SuccessResponse({
      status: "success",
      message: "berhasil mengambil data health records",
      data: {
        analysis: trendAnalyze,
        rawData: healthData,
        dailyDiagnifyScore: dailyScore,
      },
      statusCode: 200,
    });
  } catch (error) {
    return new ErrorResponse({
      status: "error",
      message: "Anda sudah mengisi Health Track hari ini. Silakan coba lagi besok.",
      error,
      statusCode: 500,
    });
  }
}

function countEveryDiagnifyScore(records) {
  return records.map((record) => {
    const input = {
      exerciseMinutes: record.exercise_minutes,
      sleepHours: record.sleep_hours,
      waterGlasses: record.water_glasses,
      junkFoodCount: record.junk_food_count,
      overallMood: record.overall_mood,
      stressLevel: record.stress_level,
      screenTimeHours: record.screen_time_hours,
      bloodPressure: record.blood_pressure,
    };

    return {
      record_date: record.record_date,
      diagnifyScore: calculateDiagnifyScore(input),
    };
  });
}

async function addHealthTrackData(req) {
  if (!req.body) {
    return new ErrorResponse({
      status: "bad request",
      message:
        "data health tracker yang dikirimkan tidak valid! harap pastikan data sudah benar",
      error: null,
      statusCode: 400,
    });
  }
  const user_id = req.auth.id;
  const {
    exercise_minutes,
    exercise_type,
    sleep_hours,
    water_glasses,
    junk_food_count,
    overall_mood,
    stress_level,
    screen_time_hours,
    blood_pressure,
  } = req.body;

  const record = {
    user_id,
    exercise_minutes,
    exercise_type,
    sleep_hours,
    water_glasses,
    junk_food_count,
    overall_mood,
    stress_level,
    screen_time_hours,
    blood_pressure,
  };

  try {
    const response = await TrackerRepo.addHealthRecord(record);
    return new SuccessResponse({
      status: "success",
      message: "berhasil menambah data health records",
      data: {
        response,
        record,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    return new ErrorResponse({
      status: "error",
      message: "Anda sudah mengisi Health Track hari ini. Silakan coba lagi besok.",
      error: error.message,
      statusCode: 400,
    });
  }
}

function analyzeHealthData(healthRecords) {
  if (healthRecords.length === 0) {
    return {
      error: "Tidak ada data untuk dianalisis",
      diagnifyScore: 0,
      analysis: {},
      recommendations: [],
    };
  }

  const weeklyData = healthRecords;

  // Hitung rata-rata untuk setiap metrik
  const analysis = {
    totalDays: weeklyData.length,
    averages: {
      exerciseMinutes: calculateAverage(weeklyData, "exercise_minutes"),
      sleepHours: calculateAverage(weeklyData, "sleep_hours"),
      waterGlasses: calculateAverage(weeklyData, "water_glasses"),
      junkFoodCount: calculateAverage(weeklyData, "junk_food_count"),
      overallMood: calculateAverage(weeklyData, "overall_mood"),
      stressLevel: calculateAverage(weeklyData, "stress_level"),
      screenTimeHours: calculateAverage(weeklyData, "screen_time_hours"),
      bloodPressure: calculateAverage(weeklyData, "blood_pressure"),
    },
    trends: analyzeTrends(weeklyData),
  };

  // Hitung Diagnify Score (0-100)
  const diagnifyScore = calculateDiagnifyScore(analysis.averages);

  // Generate recommendations
  const recommendations = generateRecommendations(analysis.averages);

  // Analisis kategori kesehatan
  const healthCategories = categorizeHealth(analysis.averages);

  return {
    period: `${weeklyData.length} hari terakhir`,
    diagnifyScore: Math.round(diagnifyScore), //perminggu
    scoreCategory: getScoreCategory(diagnifyScore),
    analysis,
    healthCategories,
    recommendations,
    summary: generateSummary(analysis.averages, diagnifyScore),
  };
}

function calculateAverage(data, field) {
  const validData = data.filter(
    (item) => item[field] !== null && item[field] !== undefined
  );
  if (validData.length === 0) return 0;

  const sum = validData.reduce((acc, item) => {
    const value =
      typeof item[field] === "string" ? parseFloat(item[field]) : item[field];
    return acc + (isNaN(value) ? 0 : value);
  }, 0);

  return Math.round((sum / validData.length) * 100) / 100;
}

function analyzeTrends(data) {
  // Analisis trend dari data terlama ke terbaru
  const sortedData = data.sort(
    (a, b) => new Date(a.record_date) - new Date(b.record_date)
  );

  if (sortedData.length < 1) return {};

  const first = sortedData[0];
  const last = sortedData[sortedData.length - 1];

  return {
    sleepTrend: getTrend(
      parseFloat(first.sleep_hours),
      parseFloat(last.sleep_hours)
    ),
    moodTrend: getTrend(first.overall_mood, last.overall_mood),
    stressTrend: getTrend(first.stress_level, last.stress_level, true), // true = lower is better
    exerciseTrend: getTrend(first.exercise_minutes, last.exercise_minutes),
  };
}

function getTrend(firstValue, lastValue, lowerIsBetter = false) {
  const diff = lastValue - firstValue;
  if (Math.abs(diff) < 0.1) return "stabil";

  if (lowerIsBetter) {
    return diff > 0 ? "memburuk" : "membaik";
  } else {
    return diff > 0 ? "membaik" : "memburuk";
  }
}

function calculateDiagnifyScore(averages) {
  let score = 0;
  let maxScore = 0;

  // Sleep Score (0-20 points)
  maxScore += 20;
  if (averages.sleepHours >= 7 && averages.sleepHours <= 9) {
    score += 20;
  } else if (averages.sleepHours >= 6 && averages.sleepHours < 7) {
    score += 15;
  } else if (averages.sleepHours >= 5 && averages.sleepHours < 6) {
    score += 10;
  } else {
    score += 5;
  }

  // Exercise Score (0-15 points)
  maxScore += 15;
  if (averages.exerciseMinutes >= 30) {
    score += 15;
  } else if (averages.exerciseMinutes >= 20) {
    score += 12;
  } else if (averages.exerciseMinutes >= 10) {
    score += 8;
  } else if (averages.exerciseMinutes > 0) {
    score += 5;
  }

  // Water Intake Score (0-10 points)
  maxScore += 10;
  if (averages.waterGlasses >= 8) {
    score += 10;
  } else if (averages.waterGlasses >= 6) {
    score += 8;
  } else if (averages.waterGlasses >= 4) {
    score += 6;
  } else {
    score += 3;
  }

  // Junk Food Score (0-10 points) - lower is better
  maxScore += 10;
  if (averages.junkFoodCount <= 1) {
    score += 10;
  } else if (averages.junkFoodCount <= 3) {
    score += 7;
  } else if (averages.junkFoodCount <= 5) {
    score += 4;
  } else {
    score += 1;
  }

  // Mood Score (0-15 points)
  maxScore += 15;
  if (averages.overallMood >= 4) {
    score += 15;
  } else if (averages.overallMood >= 3) {
    score += 12;
  } else if (averages.overallMood >= 2) {
    score += 8;
  } else {
    score += 5;
  }

  // Stress Level Score (0-10 points) - lower is better
  maxScore += 10;
  if (averages.stressLevel <= 2) {
    score += 10;
  } else if (averages.stressLevel <= 3) {
    score += 8;
  } else if (averages.stressLevel <= 4) {
    score += 5;
  } else {
    score += 2;
  }

  // Screen Time Score (0-10 points)
  maxScore += 10;
  if (averages.screenTimeHours <= 6) {
    score += 10;
  } else if (averages.screenTimeHours <= 8) {
    score += 8;
  } else if (averages.screenTimeHours <= 12) {
    score += 5;
  } else {
    score += 2;
  }

  // Blood Pressure Score (0-10 points)
  maxScore += 10;
  if (averages.bloodPressure <= 120) {
    score += 10;
  } else if (averages.bloodPressure < 90) {
    score += 7;
  } else if (50 <= averages.bloodPressure < 80) {
    score += 4;
  } else if (averages.bloodPressure < 130) {
    score += 7;
  } else if (averages.bloodPressure < 180) {
    score += 4;
  } else {
    score += 1;
  }

  return (score / maxScore) * 100;
}

function getScoreCategory(score) {
  if (score >= 85) return "Sangat Baik";
  if (score >= 70) return "Baik";
  if (score >= 55) return "Kurang";
  if (score >= 40) return "Buruk";
  return "Sangat Buruk";
}

function categorizeHealth(averages) {
  return {
    sleep:
      averages.sleepHours >= 7
        ? "Baik"
        : averages.sleepHours >= 6
        ? "Cukup"
        : "Kurang",
    exercise:
      averages.exerciseMinutes >= 30
        ? "Aktif"
        : averages.exerciseMinutes >= 15
        ? "Cukup"
        : "Kurang Aktif",
    hydration:
      averages.waterGlasses >= 8
        ? "Terhidrasi"
        : averages.waterGlasses >= 6
        ? "Cukup"
        : "Dehidrasi",
    diet:
      averages.junkFoodCount <= 2
        ? "Sehat"
        : averages.junkFoodCount <= 4
        ? "Cukup"
        : "Tidak Sehat",
    mental:
      averages.overallMood >= 4
        ? "Baik"
        : averages.overallMood >= 3
        ? "Cukup"
        : "Buruk",
    stress:
      averages.stressLevel <= 2
        ? "Rendah"
        : averages.stressLevel <= 3
        ? "Sedang"
        : "Tinggi",
    screenTime:
      averages.screenTimeHours <= 6
        ? "Baik"
        : averages.screenTimeHours <= 10
        ? "Cukup"
        : "Berlebihan",
    bloodPressure:
      averages.bloodPressure <= 120
        ? "Normal"
        : averages.bloodPressure <= 140
        ? "Tinggi"
        : "Berbahaya",
  };
}

function generateRecommendations(averages) {
  const recommendations = [];

  // Sleep recommendations
  if (averages.sleepHours < 7) {
    recommendations.push({
      category: "Tidur",
      priority: "Tinggi",
      message: `Tingkatkan durasi tidur dari ${averages.sleepHours.toFixed(
        1
      )} jam menjadi 7-9 jam per malam`,
      tips: [
        "Buat jadwal tidur yang konsisten",
        "Hindari layar gadget 1 jam sebelum tidur",
        "Ciptakan lingkungan tidur yang nyaman dan gelap",
      ],
    });
  }

  // Exercise recommendations
  if (averages.exerciseMinutes < 30) {
    recommendations.push({
      category: "Olahraga",
      priority: averages.exerciseMinutes < 15 ? "Tinggi" : "Sedang",
      message: `Tingkatkan aktivitas fisik dari ${Math.round(
        averages.exerciseMinutes
      )} menit menjadi minimal 30 menit per hari`,
      tips: [
        "Mulai dengan olahraga ringan seperti jalan kaki",
        "Naik tangga daripada lift",
        "Lakukan stretching setiap pagi",
      ],
    });
  }

  // Water intake recommendations
  if (averages.waterGlasses < 8) {
    recommendations.push({
      category: "Hidrasi",
      priority: "Sedang",
      message: `Tingkatkan konsumsi air dari ${Math.round(
        averages.waterGlasses
      )} gelas menjadi 8-10 gelas per hari`,
      tips: [
        "Bawa botol air kemana-mana",
        "Minum segelas air setelah bangun tidur",
        "Set reminder untuk minum air setiap 2 jam",
      ],
    });
  }

  // Junk food recommendations
  if (averages.junkFoodCount > 3) {
    recommendations.push({
      category: "Diet",
      priority: "Tinggi",
      message: `Kurangi konsumsi junk food dari ${Math.round(
        averages.junkFoodCount
      )} kali menjadi maksimal 2 kali per minggu`,
      tips: [
        "Siapkan camilan sehat seperti buah atau kacang",
        "Masak makanan di rumah lebih sering",
        "Baca label nutrisi sebelum membeli makanan",
      ],
    });
  }

  // Mood recommendations
  if (averages.overallMood < 3) {
    recommendations.push({
      category: "Kesehatan Mental",
      priority: "Tinggi",
      message: "Tingkatkan mood dan kesejahteraan mental",
      tips: [
        "Luangkan waktu untuk hobi yang disukai",
        "Bersosialisasi dengan keluarga dan teman",
        "Praktikkan mindfulness atau meditasi",
      ],
    });
  }

  // Stress recommendations
  if (averages.stressLevel > 3) {
    recommendations.push({
      category: "Manajemen Stress",
      priority: "Tinggi",
      message: "Kelola tingkat stress yang tinggi",
      tips: [
        "Praktikkan teknik pernapasan dalam",
        "Lakukan aktivitas relaksasi seperti yoga",
        "Identifikasi dan atasi sumber stress",
      ],
    });
  }

  // Screen time recommendations
  if (averages.screenTimeHours > 8) {
    recommendations.push({
      category: "Screen Time",
      priority: "Sedang",
      message: `Kurangi waktu layar dari ${averages.screenTimeHours.toFixed(
        1
      )} jam per hari`,
      tips: [
        "Buat zona bebas gadget di rumah",
        "Gunakan aplikasi untuk membatasi waktu layar",
        "Ganti aktivitas layar dengan aktivitas fisik",
      ],
    });
  }

  // Blood pressure recommendations
  if (averages.bloodPressure > 130) {
    recommendations.push({
      category: "Tekanan Darah",
      priority: averages.bloodPressure > 160 ? "Kritis" : "Tinggi",
      message: `Perhatian! Tekanan darah tinggi (${Math.round(
        averages.bloodPressure
      )} mmHg)`,
      tips: [
        "Konsultasi dengan dokter segera",
        "Kurangi konsumsi garam",
        "Tingkatkan aktivitas fisik secara bertahap",
        "Kelola stress dengan baik",
      ],
    });
  }

  return recommendations;
}

function generateSummary(averages, score) {
  const sleepStatus = averages.sleepHours >= 7 ? "cukup" : "kurang";
  const exerciseStatus =
    averages.exerciseMinutes >= 30 ? "aktif" : "kurang aktif";
  const moodStatus = averages.overallMood >= 3 ? "baik" : "perlu perhatian";

  return `Berdasarkan analisis ${sleepStatus} tidur (${averages.sleepHours.toFixed(
    1
  )} jam/hari), ${exerciseStatus} dalam berolahraga (${Math.round(
    averages.exerciseMinutes
  )} menit/hari), dan mood ${moodStatus} (${averages.overallMood.toFixed(
    1
  )}/5). Diagnify Score Anda adalah ${Math.round(score)}/100.`;
}

export { getUserHealthData, addHealthTrackData };