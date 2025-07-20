# Dokumentasi API Diagnify

Ini adalah dokumentasi API untuk layanan mikro Diagnify, bagian dari proyek IT FEST. Dokumen ini menjelaskan detail _endpoint_, format permintaan dan respons, serta struktur data yang digunakan dalam API ini.

## Pendahuluan

API ini menyediakan fungsionalitas untuk manajemen pengguna dan pembaruan profil. Semua _endpoint_ dirancang mengikuti prinsip-prinsip RESTful.

### Basis URL

`https://api.ayuwoki.my.id/users/`

### Autentikasi

Beberapa _endpoint_ memerlukan autentikasi menggunakan **Bearer Token**. Setelah login, Anda akan menerima `accessToken` yang harus disertakan dalam _header_ `authorization` untuk setiap permintaan yang dilindungi, dengan format:

`authorization: Bearer {your_access_token}`

---

## Autentikasi Pengguna

### Register Pengguna

Membuat akun pengguna baru di sistem.

- **POST /api/register**

**Deskripsi:**
Mendaftarkan pengguna baru dengan kredensial yang diberikan.

**Request Body:**

- **Content-Type:** `application/json`

<!-- end list -->

```json
{
  "email": "user@example.com",
  "password": "strongPassword123",
  "username": "diagnifyUser",
  "fullName": "Diagnify User Name"
}
```

**Properties:**

| Nama Field | Tipe     | Deskripsi                       | Wajib |
| :--------- | :------- | :------------------------------ | :---- |
| `email`    | `string` | Alamat email unik pengguna.     | Ya    |
| `password` | `string` | Kata sandi untuk akun pengguna. | Ya    |
| `username` | `string` | Nama pengguna unik.             | Ya    |
| `fullName` | `string` | Nama lengkap pengguna.          | Ya    |

**Responses:**

- **`201 Created` - Akun Berhasil Dibuat**

  - **Deskripsi:** Pengguna berhasil didaftarkan.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "success",
    "message": "Akun berhasil dibuat! Silakan login.",
    "data": {
      "username": "diagnifyUser",
      "created_at": "2025-07-16T14:30:00Z"
    }
  }
  ```

- **`400 Bad Request` - Validasi Gagal**

  - **Deskripsi:** Permintaan tidak valid karena data yang diberikan salah atau tidak lengkap.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "error",
    "message": "Validation failed",
    "errors": "error detail"
  }
  ```

- **`409 Conflict` - Email atau Username Sudah Terdaftar**

  - **Deskripsi:** Alamat email atau nama pengguna yang diberikan sudah digunakan.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "error",
    "message": "Username or email already exists",
    "errors": null
  }
  ```

---

### Login Pengguna

Mengautentikasi pengguna dan memberikan token akses.

- **POST /api/login**

**Deskripsi:**
Memvalidasi kredensial pengguna dan mengembalikan token akses JWT yang diperlukan untuk permintaan yang terautentikasi.

**Request Body:**

- **Content-Type:** `application/json`

<!-- end list -->

```json
{
  "username": "diagnifyUser",
  "password": "strongPassword123"
}
```

**Properties:**

| Nama Field | Tipe     | Deskripsi                                     | Wajib |
| :--------- | :------- | :-------------------------------------------- | :---- |
| `username` | `string` | Nama pengguna yang terdaftar.                 | Ya    |
| `password` | `string` | Kata sandi yang terkait dengan nama pengguna. | Ya    |

**Responses:**

- **`200 OK` - Login Berhasil**

  - **Deskripsi:** Pengguna berhasil login dan menerima token akses.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "success",
    "message": "Berhasil login",
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJkaWFnbmlmeVVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6y"
    }
  }
  ```

- **`401 Unauthorized` - Kredensial Tidak Valid**

  - **Deskripsi:** Nama pengguna atau kata sandi tidak cocok.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "failed",
    "message": "Invalid username or password",
    "errors": null
  }
  ```

---

### Logout Pengguna

- **Tidak ada _endpoint_ Backend untuk Logout**

**Deskripsi:**
Untuk fungsionalitas logout, **Frontend bertanggung jawab** untuk menghapus `accessToken` yang disimpan secara lokal (misalnya dari `localStorage` atau `sessionStorage`). Tidak ada _endpoint_ khusus di _backend_ yang diperlukan karena `accessToken` adalah _stateless_ dan masa berlakunya ditentukan saat pembuatan.

---

## Lupa Kata Sandi (Forgot Password)

Alur ini memungkinkan pengguna untuk reset pw ygy kalo lupa. Terserah mau ditaro juga di bagian profile apa engga. Tapi kalo mau ditaro di profile juga, alurnya harus disamain

### 1\. Meminta Kode Reset Kata Sandi

Pengguna memasukkan nama pengguna mereka untuk memulai proses reset kata sandi.

- **POST /api/forgot-password**

**Deskripsi:**
Memicu pengiriman kode reset 6 digit ke alamat email pengguna yang terdaftar.

**Request Body:**

- **Content-Type:** `application/json`

<!-- end list -->

```json
{
  "username": "diagnifyUser"
}
```

**Properties:**

| Nama Field | Tipe     | Deskripsi                           | Wajib |
| :--------- | :------- | :---------------------------------- | :---- |
| `username` | `string` | Nama pengguna yang lupa kata sandi. | Ya    |

**Responses:**

- **`200 OK` - Kode Dikirim**

  - **Deskripsi:** Kode reset berhasil dikirim ke email pengguna.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "success",
    "message": "Kode sudah dikirimkan ke email",
    "data": {
      "email": "user@example.com"
    }
  }
  ```

- **`404 Not Found` - Username Tidak Ditemukan**

  - **Deskripsi:** Nama pengguna yang diberikan tidak ditemukan di sistem.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "NOT FOUND",
    "message": "username tidak ditemukan",
    "error": null
  }
  ```

---

### 2\. Verifikasi Kode Reset

Setelah _backend_ mengirimkan kode 6 digit ke email pengguna, pengguna memasukkan kode tersebut untuk verifikasi.

- **POST /api/verify-reset-code**

**Deskripsi:**
Memvalidasi kode reset yang diberikan oleh pengguna. Jika valid, _backend_ akan mengembalikan `tempToken` yang diperlukan untuk langkah pengaturan ulang kata sandi.

**Request Body:**

- **Content-Type:** `application/json`

<!-- end list -->

```json
{
  "email": "user@example.com",
  "resetCode": "123456"
}
```

**Properties:**

| Nama Field  | Tipe     | Deskripsi                                  | Wajib |
| :---------- | :------- | :----------------------------------------- | :---- |
| `email`     | `string` | Alamat email pengguna.                     | Ya    |
| `resetCode` | `string` | Kode reset 6 digit yang diterima pengguna. | Ya    |

**Responses:**

- **`200 OK` - Kode Terverifikasi**

  - **Deskripsi:** Kode reset berhasil diverifikasi, dan `tempToken` diberikan.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "success",
    "message": "Berhasil memverifikasi kode reset token",
    "data": {
      "tempToken": "tempCodeDariBackendYangValid"
    }
  }
  ```

- **`400 Bad Request` - Kode Tidak Valid/Kedaluwarsa**

  - **Deskripsi:** Kode reset yang diberikan tidak valid atau sudah kedaluwarsa.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "error",
    "message": "Kode sudah expire atau tidak ditemukan!",
    "error": null,
    "statusCode": 400
  }
  ```

---

### 3\. Perbarui Kata Sandi Baru

Setelah kode reset diverifikasi, _frontend_ harus mengarahkan pengguna ke formulir untuk memasukkan kata sandi baru mereka.

- **POST /api/update-password**

**Deskripsi:**
Memperbarui kata sandi pengguna dengan kata sandi baru yang disediakan, menggunakan `tempToken` yang didapat dari langkah verifikasi kode.

**Request Body:**

- **Content-Type:** `application/json`

<!-- end list -->

```json
{
  "tempToken": "tempCodeDariBackendYangValid",
  "newPassword": "newStrongPassword789"
}
```

**Properties:**

| Nama Field    | Tipe     | Deskripsi                                           | Wajib |
| :------------ | :------- | :-------------------------------------------------- | :---- |
| `tempToken`   | `string` | Token sementara dari langkah verifikasi kode reset. | Ya    |
| `newPassword` | `string` | Kata sandi baru yang ingin diatur pengguna.         | Ya    |

**Responses:**

- **`200 OK` - Kata Sandi Berhasil Diperbarui**

  - **Deskripsi:** Kata sandi pengguna berhasil diubah.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "success",
    "message": "Mengupdate password",
    "data": null
  }
  ```

- **`400 Bad Request` - Gagal Memperbarui Kata Sandi**

  - **Deskripsi:** Terjadi kesalahan selama proses pembaruan kata sandi, mungkin karena `tempToken` tidak valid atau masalah internal lainnya.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "error",
    "message": "Terjadi kesalahan saat mengganti password! Operasi dibatalkan",
    "error": ["Invalid or expired tempToken"]
  }
  ```

---

## Manajemen Profil

### Memperbarui Data Profil

Memperbarui informasi profil pengguna yang sudah ada.

- **POST /api/update/profile**

**Deskripsi:**
Memperbarui satu atau lebih bidang data profil pengguna. Autentikasi diperlukan.

**Request Headers:**

| Nama Header     | Tipe     | Deskripsi                                   | Wajib |
| :-------------- | :------- | :------------------------------------------ | :---- |
| `authorization` | `string` | Token akses Bearer yang didapat dari login. | Ya    |

**Request Body:**

- **Content-Type:** `application/json`

<!-- end list -->

```json
{
  "age": 17,
  "gender": "lainnya",
  "height_cm": 165,
  "weight_kg": 63,
  "smoking_status": "tidak aktif",
  "chronic_diseases": ["jantung", "magh", "wasir"],
  "fullName": "Nama Baru Pengguna",
  "email": "email_baru@example.com",
  "username": "username_baru"
}
```

**Properties:**
_Catatan: Hanya sertakan bidang yang ingin Anda perbarui. Bidang lain akan diabaikan jika tidak ada dalam daftar yang diizinkan._

| Nama Field         | Tipe                | Deskripsi                                             | Wajib |
| :----------------- | :------------------ | :---------------------------------------------------- | :---- |
| `age`              | `integer`           | Usia pengguna.                                        | Tidak |
| `gender`           | `string`            | Jenis kelamin pengguna (`pria`, `wanita`, `lainnya`). | Tidak |
| `height_cm`        | `integer`           | Tinggi pengguna dalam sentimeter.                     | Tidak |
| `weight_kg`        | `integer`           | Berat pengguna dalam kilogram.                        | Tidak |
| `smoking_status`   | `string`            | Status merokok pengguna (`aktif`, `tidak aktif`).     | Tidak |
| `chronic_diseases` | `array` of `string` | Daftar penyakit kronis yang diderita pengguna.        | Tidak |
| `fullName`         | `string`            | Nama lengkap pengguna.                                | Tidak |
| `email`            | `string`            | Alamat email pengguna.                                | Tidak |
| `username`         | `string`            | Nama pengguna.                                        | Tidak |

**Responses:**

- **`200 OK` - Profil Berhasil Diperbarui**

  - **Deskripsi:** Profil pengguna berhasil diperbarui. Objek `data` hanya akan berisi bidang-bidang yang berhasil diperbarui.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "success",
    "message": "Berhasil mengupdate fields",
    "data": {
      "gender": "pria"
    },
    "statusCode": 200
  }
  ```

  Contoh lain (jika semua bidang diperbarui):

  ```json
  {
    "status": "success",
    "message": "Berhasil mengupdate fields",
    "data": {
      "age": 17,
      "gender": "lainnya",
      "height_cm": 165,
      "weight_kg": 63,
      "smoking_status": "tidak aktif",
      "chronic_diseases": ["jantung", "magh", "wasir"]
    },
    "statusCode": 200
  }
  ```

- **`401 Unauthorized` - Tidak Terautentikasi**

  - **Deskripsi:** Permintaan tidak memiliki token akses yang valid atau token tidak diberikan.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "error",
    "message": "Unauthorized: Access token is missing or invalid",
    "errors": null
  }
  ```

- **`400 Bad Request` - Gagal Memperbarui Data**

  - **Deskripsi:** Terjadi kesalahan saat memperbarui data, mungkin karena validasi data yang tidak sesuai atau masalah internal lainnya.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "error",
    "message": "terjadi kesalahan saat menggupdate data! operasi dibatalkan",
    "error": ["Invalid value for age", "Email already in use"],
    "statusCode": 400
  }
  ```

### my profile

Mengambil detail profil dari user itu sendiri

- **GET /api/me**

**Deskripsi:**
Mengambil semua informasi profil pengguna yang terautentikasi. _Endpoint_ ini memerlukan token akses yang valid.

**Request Headers:**

| Nama Header     | Tipe     | Deskripsi                                   | Wajib |
| :-------------- | :------- | :------------------------------------------ | :---- |
| `authorization` | `string` | Token akses Bearer yang didapat dari login. | Ya    |
|                 |          | Contoh: `Bearer {your_access_token}`        |       |

**Responses:**

- **`200 OK` - Data Profil Berhasil Diambil**

  - **Deskripsi:** Detail profil pengguna berhasil diambil.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "success",
    "message": "berhasil mengambil data user",
    "data": {
      "email": "agmerguna@gmail.com",
      "username": "agmerDev",
      "fullName": "Rizky Ramadhan Agmer",
      "age": 19,
      "gender": "pria",
      "height": 166,
      "weight": "65.00",
      "chronicDiseases": ["jantung", "magh", "wasir"],
      "smokingStatus": "tidak aktif",
      "profilePicture": "d2e4fdfc-f700-4ae7-a558-e75684559ec7.jpg"
    },
    "statusCode": 200
  }
  ```

  **Properties `data`:**

  | Nama Field        | Tipe                    | Deskripsi                             |
  | :---------------- | :---------------------- | :------------------------------------ |
  | `email`           | `string`                | Alamat email pengguna.                |
  | `username`        | `string`                | Nama pengguna.                        |
  | `fullName`        | `string`                | Nama lengkap pengguna.                |
  | `age`             | `integer`               | Usia pengguna.                        |
  | `gender`          | `string`                | Jenis kelamin pengguna.               |
  | `height`          | `integer`               | Tinggi pengguna dalam sentimeter.     |
  | `weight`          | `string` (atau `float`) | Berat pengguna dalam kilogram.        |
  | `chronicDiseases` | `array` of `string`     | Daftar penyakit kronis yang diderita. |
  | `smokingStatus`   | `string`                | Status merokok pengguna.              |
  | `profilePicture`  | `string`                | Nama file gambar profil (jika ada).   |

- **`401 Unauthorized` - Token Tidak Valid/Kedaluwarsa**

  - **Deskripsi:** Token akses tidak ada, tidak valid, atau sudah kedaluwarsa, sehingga pengguna tidak dapat mengakses data profil.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "unauthorized",
    "message": "Token telah kedaluwarsa",
    "error": null,
    "statusCode": 401
  }
  ```

---

### update image

Mengunggah atau memperbarui foto profil pengguna.

- **POST /api/photoprofile**

**Deskripsi:**
Mengunggah file gambar sebagai foto profil pengguna. _Endpoint_ ini memerlukan token akses yang valid dan menerima data dalam format `multipart/form-data`. Hanya file gambar dengan ukuran maksimum 2 MB yang diizinkan.

**Request Headers:**

| Nama Header     | Tipe     | Deskripsi                                   | Wajib |
| :-------------- | :------- | :------------------------------------------ | :---- |
| `Authorization` | `string` | Token akses Bearer yang didapat dari login. | Ya    |
|                 |          | Contoh: `Bearer {your_access_token}`        |       |
| `Content-Type`  | `string` | Harus `multipart/form-data`.                | Ya    |

**Request Body:**

- **Content-Type:** `multipart/form-data`

| Nama Field | Tipe   | Deskripsi                                                 | Wajib |
| :--------- | :----- | :-------------------------------------------------------- | :---- |
| `image`    | `file` | File gambar yang akan diunggah.                           | Ya    |
|            |        | **Batasan:** Maksimal 2 MB, tipe gambar (PNG, JPG, JPEG). |       |

**Responses:**

- **`201 Created` - Foto Profil Berhasil Diunggah**

  - **Deskripsi:** Foto profil berhasil diunggah dan diperbarui. Respons akan mengembalikan nama file gambar yang disimpan.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "success",
    "message": "berhasil mengupdate foto profile",
    "data": "0b173005-ed53-4718-9155-18e8d527f139.jpg",
    "statusCode": 201
  }
  ```

  **Akses Gambar:**
  Gambar yang diunggah dapat diakses melalui URL berikut:
  `https://api.ayuwoki.my.id/users/uploads/{nama_file_gambar}`
  Contoh: `https://api.ayuwoki.my.id/users/uploads/0b173005-ed53-4718-9155-18e8d527f139.jpg`

- **`401 Unauthorized` - Tidak Terautentikasi**

  - **Deskripsi:** Pengguna belum login atau token akses tidak valid.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "unauthorized",
    "message": "Harap lakukan login terlebih dahulu sebelum mengakses fitur ini",
    "error": null,
    "statusCode": 401
  }
  ```

- **`400 Bad Request` - Gagal Mengunggah Gambar**

  - **Deskripsi:** Permintaan gagal karena berbagai alasan seperti file tidak valid, ukuran terlalu besar, atau tipe file tidak didukung.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "error",
    "message": "gagal mengunggah gambar",
    "error": "File terlalu besar. Maksimal 2 MB.",
    "statusCode": 400
  }
  ```

  Contoh error lain:

  ```json
  {
    "status": "error",
    "message": "gagal mengunggah gambar",
    "error": "Tipe file tidak didukung. Hanya gambar (JPG, JPEG, PNG) yang diizinkan.",
    "statusCode": 400
  }
  ```

  ```json
  {
    "status": "error",
    "message": "terjadi kesalahan saat mengunggah foto profile! operasi dibatalkan",
    "error": ["internal server error"],
    "statusCode": 400
  }
  ```

---

## Health Tracker

### Basis URL

- **API Health Tracker:** `https://api.ayuwoki.my.id/`

### Autentikasi

semua _endpoint_ memerlukan autentikasi menggunakan **Bearer Token**. Setelah login, Anda akan menerima `accessToken` yang harus disertakan dalam _header_ `authorization` untuk setiap permintaan yang dilindungi, dengan format:

`authorization: Bearer {your_access_token}`

---

## Health Tracker

Bagian ini mencakup _endpoint_ untuk mengelola dan melihat data pelacakan kesehatan pengguna.

### Mendapatkan Data Pelacakan Kesehatan (Health Tracker)

Mengambil data _health tracker_ pengguna beserta analisis dari seminggu terakhir.

- **GET /users/tracker**

**Deskripsi:**
Mengambil riwayat data pelacakan kesehatan pengguna selama seminggu terakhir dan menghasilkan analisis komprehensif, termasuk skor, tren, dan rekomendasi kesehatan. _Endpoint_ ini memerlukan token akses yang valid.

**Request Headers:**

| Nama Header     | Tipe     | Deskripsi                                   | Wajib |
| :-------------- | :------- | :------------------------------------------ | :---- |
| `authorization` | `string` | Token akses Bearer yang didapat dari login. | Ya    |
|                 |          | Contoh: `Bearer {your_access_token}`        |       |

**Responses:**

- **`200 OK` - Data Health Records Berhasil Diambil**

  - **Deskripsi:** Data _health tracker_ dan analisis lengkap berhasil diambil.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "success",
    "message": "berhasil mengambil data health records",
    "data": {
      "analysis": {
        "period": "2 hari terakhir",
        "diagnifyScore": 91,
        "scoreCategory": "Excellent",
        "analysis": {
          "totalDays": 2,
          "averages": {
            "exerciseMinutes": 30,
            "sleepHours": 9,
            "waterGlasses": 8,
            "junkFoodCount": 1,
            "overallMood": 2,
            "stressLevel": 2,
            "screenTimeHours": 6,
            "bloodPressure": 125
          },
          "trends": {
            "sleepTrend": "stabil",
            "moodTrend": "stabil",
            "stressTrend": "stabil",
            "exerciseTrend": "stabil"
          }
        },
        "healthCategories": {
          "sleep": "Baik",
          "exercise": "Aktif",
          "hydration": "Terhidrasi",
          "diet": "Sehat",
          "mental": "Buruk",
          "stress": "Rendah",
          "screenTime": "Baik",
          "bloodPressure": "Tinggi"
        },
        "recommendations": [
          {
            "category": "Kesehatan Mental",
            "priority": "Tinggi",
            "message": "Tingkatkan mood dan kesejahteraan mental",
            "tips": [
              "Luangkan waktu untuk hobi yang disukai",
              "Bersosialisasi dengan keluarga dan teman",
              "Praktikkan mindfulness atau meditasi"
            ]
          }
        ],
        "summary": "Berdasarkan analisis cukup tidur (9.0 jam/hari), aktif dalam berolahraga (30 menit/hari), dan mood perlu perhatian (2.0/5). Diagnify Score Anda adalah 91/100."
      }
    },
    "statusCode": 200
  }
  ```

  **Properties `data.analysis`:**

  | Nama Field                          | Tipe                | Deskripsi                                                                 |
  | :---------------------------------- | :------------------ | :------------------------------------------------------------------------ |
  | `period`                            | `string`            | Rentang waktu data yang dianalisis (misal: "7 hari terakhir").            |
  | `diagnifyScore`                     | `integer`           | Skor kesehatan keseluruhan (0-100).                                       |
  | `scoreCategory`                     | `string`            | Kategori skor (misal: "Excellent", "Good", "Fair", "Poor").               |
  | `analysis`                          | `object`            | Objek berisi detail analisis lebih lanjut.                                |
  | `analysis.totalDays`                | `integer`           | Jumlah hari yang termasuk dalam analisis.                                 |
  | `analysis.averages`                 | `object`            | Rata-rata harian untuk setiap metrik kesehatan.                           |
  | `analysis.averages.exerciseMinutes` | `integer`           | Rata-rata menit olahraga per hari.                                        |
  | `analysis.averages.sleepHours`      | `integer`           | Rata-rata jam tidur per hari.                                             |
  | `analysis.averages.waterGlasses`    | `integer`           | Rata-rata gelas air yang diminum per hari.                                |
  | `analysis.averages.junkFoodCount`   | `integer`           | Rata-rata konsumsi makanan cepat saji per hari.                           |
  | `analysis.averages.overallMood`     | `integer`           | Rata-rata tingkat _mood_ keseluruhan (skala 1-5).                         |
  | `analysis.averages.stressLevel`     | `integer`           | Rata-rata tingkat stres (skala 1-5).                                      |
  | `analysis.averages.screenTimeHours` | `integer`           | Rata-rata jam waktu layar per hari.                                       |
  | `analysis.averages.bloodPressure`   | `integer`           | Rata-rata tekanan darah (contoh: nilai sistolik).                         |
  | `analysis.trends`                   | `object`            | Tren perubahan metrik kesehatan.                                          |
  | `analysis.trends.sleepTrend`        | `string`            | Tren tidur (`stabil`, `meningkat`, `menurun`).                            |
  | `analysis.trends.moodTrend`         | `string`            | Tren _mood_ (`stabil`, `meningkat`, `menurun`).                           |
  | `analysis.trends.stressTrend`       | `string`            | Tren stres (`stabil`, `meningkat`, `menurun`).                            |
  | `analysis.trends.exerciseTrend`     | `string`            | Tren olahraga (`stabil`, `meningkat`, `menurun`).                         |
  | `healthCategories`                  | `object`            | Kategori kesehatan berdasarkan performa (misal: "Baik", "Buruk").         |
  | `recommendations`                   | `array` of `object` | Daftar rekomendasi yang dihasilkan berdasarkan area yang perlu perbaikan. |
  | `recommendations[].category`        | `string`            | Kategori kesehatan untuk rekomendasi.                                     |
  | `recommendations[].priority`        | `string`            | Prioritas rekomendasi (`Tinggi`, `Sedang`, `Rendah`).                     |
  | `recommendations[].message`         | `string`            | Pesan singkat rekomendasi.                                                |
  | `recommendations[].tips`            | `array` of `string` | Daftar tips spesifik untuk rekomendasi tersebut.                          |
  | `summary`                           | `string`            | Ringkasan singkat dari analisis kesehatan.                                |

- **`401 Unauthorized` - Token Tidak Valid/Kedaluwarsa**

  - **Deskripsi:** Token akses tidak ada, tidak valid, atau sudah kedaluwarsa, sehingga pengguna tidak dapat mengakses data _health tracker_.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "unauthorized",
    "message": "Token telah kedaluwarsa",
    "error": null,
    "statusCode": 401
  }
  ```

---

### Menambahkan Data Pelacakan Kesehatan Harian

Mengirimkan data _health tracker_ harian pengguna.

- **POST /users/tracker**

**Deskripsi:**
Menambahkan catatan data kesehatan harian baru untuk pengguna yang terautentikasi. _Endpoint_ ini memerlukan token akses yang valid. Pengguna hanya dapat mengirimkan satu data catatan kesehatan per hari.

**Request Headers:**

| Nama Header     | Tipe     | Deskripsi                                   | Wajib |
| :-------------- | :------- | :------------------------------------------ | :---- |
| `Authorization` | `string` | Token akses Bearer yang didapat dari login. | Ya    |
|                 |          | Contoh: `Bearer {your_access_token}`        |       |

**Request Body:**

- **Content-Type:** `application/json`

<!-- end list -->

```json
{
  "user_id": 4,
  "exercise_minutes": 30,
  "exercise_type": "jalan_kaki",
  "sleep_hours": 9,
  "water_glasses": 8,
  "junk_food_count": 1,
  "overall_mood": 2,
  "stress_level": 2,
  "screen_time_hours": 6.0,
  "blood_pressure": 125
}
```

**Properties:**

| Nama Field          | Tipe      | Deskripsi                                                    | Wajib |
| :------------------ | :-------- | :----------------------------------------------------------- | :---- |
| `user_id`           | `integer` | ID unik pengguna.                                            | Ya    |
| `exercise_minutes`  | `integer` | Durasi olahraga dalam menit.                                 | Ya    |
| `exercise_type`     | `string`  | Jenis olahraga yang dilakukan (misal: "jalan_kaki", "lari"). | Ya    |
| `sleep_hours`       | `integer` | Durasi tidur dalam jam.                                      | Ya    |
| `water_glasses`     | `integer` | Jumlah gelas air yang diminum.                               | Ya    |
| `junk_food_count`   | `integer` | Jumlah porsi makanan cepat saji yang dikonsumsi.             | Ya    |
| `overall_mood`      | `integer` | Tingkat suasana hati secara keseluruhan (skala 1-5).         | Ya    |
| `stress_level`      | `integer` | Tingkat stres (skala 1-5).                                   | Ya    |
| `screen_time_hours` | `float`   | Durasi waktu layar dalam jam.                                | Ya    |
| `blood_pressure`    | `integer` | Tekanan darah (nilai sistolik).                              | Ya    |

**Responses:**

- **`200 OK` - Data Health Records Berhasil Ditambahkan**

  - **Deskripsi:** Catatan data kesehatan harian berhasil disimpan.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "success",
    "message": "berhasil menambah data health records",
    "data": {
      "response": {
        "id": 4,
        "user_id": 4,
        "record_date": "2025-07-16T00:00:00.000Z",
        "created_at": "2025-07-16T14:50:03.510Z",
        "updated_at": "2025-07-16T14:50:03.510Z",
        "exercise_minutes": 30,
        "exercise_type": "jalan_kaki",
        "sleep_hours": "9.0",
        "water_glasses": 8,
        "junk_food_count": 1,
        "overall_mood": 2,
        "stress_level": 2,
        "screen_time_hours": "6.0",
        "blood_pressure": 125
      },
      "record": {
        "user_id": 4,
        "exercise_minutes": 30,
        "exercise_type": "jalan_kaki",
        "sleep_hours": 9,
        "water_glasses": 8,
        "junk_food_count": 1,
        "overall_mood": 2,
        "stress_level": 2,
        "screen_time_hours": 6,
        "blood_pressure": 125
      }
    },
    "statusCode": 200
  }
  ```

- **`401 Unauthorized` - Tidak Terautentikasi**

  - **Deskripsi:** Pengguna belum login atau token akses tidak valid.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "unauthorized",
    "message": "Harap lakukan login terlebih dahulu sebelum mengakses fitur ini",
    "error": null,
    "statusCode": 401
  }
  ```

- **`400 Bad Request` - Data Sudah Ada / Validasi Gagal**

  - **Deskripsi:** Permintaan gagal karena data catatan kesehatan untuk hari ini sudah ada (konflik `unique_user_date`) atau karena ada masalah validasi data lainnya.
  - **Content-Type:** `application/json`

  <!-- end list -->

  ```json
  {
    "status": "error",
    "message": "gagal mengambil data health records",
    "error": "duplicate key value violates unique constraint \"unique_user_date\"",
    "statusCode": 400
  }
  ```

  Contoh lain untuk validasi gagal :

  ```json
  {
    "status": "error",
    "message": "Validation failed",
    "errors": [
      {
        "field": "sleep_hours",
        "message": "Sleep hours must be between 0 and 24"
      }
    ],
    "statusCode": 400
  }
  ```

---
