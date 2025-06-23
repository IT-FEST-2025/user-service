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
  "data": null
}
```

## LOGOUT USER

## FORGOT PASSWORD

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
