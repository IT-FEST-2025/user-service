# SERVICE API SPECIFICATION

Repo ini adalah microservice dari project diagnify buat IT FEST. Di api spec ini isinya itu
endpoint dari service api, response dari api dan juga struktur repo nya.

## REGISTER USER

**Endpoint** :POST /api/register

**Request body** :

```json
{
  "email": "user@email.com",
  "password": "userpassword",
  "username": "accountName",
  "fullName": "fullname"
}
```

**Response body Success 🟢** :

```json
{
  "status": "success",
  "message": "akun berhasil dibuat! silahkan login",
  "data": {
    "username": "username",
    "created_at": "timestamp"
  }
}
```

**Response body error ❌** :

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is invalid"
    }
  ]
}
```

## LOGIN USER

**Endpoint** :POST /api/login

**Request body** :

```json
{
  "username": "account name",
  "password": "password"
}
```

**Response body success** :

```json
{
  "status": "success",
  "message": "berhasil login",
  "data": {
    "accessToken": "unique-token"
  }
}
```

**Response body failed** :

```json
{
  "status": "failed",
  "message": "invalid username or password",
  "errors": null
}
```

## LOGOUT USER

## FORGOT PASSWORD

Alur/flow untuk forgot password :

1. User input username di FE → POST ke BE :

   **endpoint** : POST /api/forgot-password :

req body

```json
{
  "username": "username"
}
```

response body Success :

```json
{
  "status": "success",
  "message": "kode sudah dikirimkan ke email",
  "data": {
    "email": "userEmail"
  }
}
```

Response body gagal :

```json
{
  "status": "NOT FOUND",
  "message": "username tidak ditemukan",
  "error": null
}
```

---

2. BE generate kode 6 digit → simpan di DB → kirim email
3. User input kode di FE → POST ke BE untuk validasi

**endpoint** : POST /api/verify-reset-code :

request body :

```json
{
  "email": "user email",
  "resetCode": "resetvode"
}
```

4. Kalau valid → FE redirect ke form password baru
5. User input password baru → POST ke BE untuk update

## update data

**Endpoint** : POST /api/update/profile
User harus login dulu buat akses endpoint ini!

Request Body :

```json
{
  "updateFields": {
    "age": 17,
    "gender": "lainnya",
    "height_cm": 165,
    "weight_kg": 63,
    "smoking_status": "tidak aktif",
    "chronic_diseases": ["jantung", "magh", "wasir"]
  }
}
```

## HEALT-TRACKING

## USER SCHEMA

Schema user untuk data awal yang bakal diminta

```sql
CREATE TABLE USERS(
    id serial primary key,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    age INTEGER,
    gender VARCHAR(10) CHECK (gender IN ('pria', 'wanita', 'lainnya')),
    height INTEGER,
    weight DECIMAL(5,2));
```
