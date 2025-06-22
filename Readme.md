# User Service

Microservice buat user management dan healthtracking.

## Deskripsi

User Service adalah microservice yang bertanggung jawab untuk:

- Manajemen autentikasi pengguna (login, logout, register)
- Pelacakan kesehatan dan status pengguna
- Manajemen profil pengguna
- Validasi dan otorisasi akses

## Fitur Utama

### Authentication

- **Register**: Pendaftaran pengguna baru
- **Login**: Autentikasi pengguna dengan email/username dan password
- **Logout**: Menghapus session pengguna
- **Refresh Token**: Memperbarui access token
- **Password Reset**: Reset password melalui email
- **Change Password**: Mengubah password pengguna

### Health Tracking

- **Health Status**: Melacak status kesehatan pengguna
- **Health History**: Riwayat data kesehatan pengguna
- **Health advice**: Notifikasi berdasarkan kondisi kesehatan

### User Management

- **Profile Management**: Mengelola profil pengguna, password dll

## Teknologi yang Digunakan

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Token)
- **ORM**: PRISMA ORM

### Environment Variables

```env
# Database
DB_HOST=localhost (nanti ganti sama url db)
DB_PORT=5432 (nanti ganti)
DB_NAME=user_service
DB_USER=root
DB_PASSWORD=""

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Service Configuration
PORT=3001
NODE_ENV=development
```

### Setup Lokal

```bash
# Clone repository
git clone <repository-url>
cd user-service

# Install dependencies
npm install

# Setup database
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

### Setup dengan Docker

```bash
# Build dan jalankan dengan docker-compose
docker-compose up -d

# Atau build manual
docker build -t user-service .
docker run -p 3001:3001 user-service
```

## API Endpoints

### Authentication Endpoints

```
POST   /api/auth/register          - Registrasi pengguna baru
POST   /api/auth/login             - Login pengguna
POST   /api/auth/logout            - Logout pengguna
POST   /api/auth/refresh           - Refresh access token
POST   /api/auth/forgot-password   - Request reset password
POST   /api/auth/reset-password    - Reset password
PUT    /api/auth/change-password   - Ubah password
```

### User Management Endpoints

```
GET    /api/users/profile          - Dapatkan profil pengguna
PUT    /api/users/profile          - Update profil pengguna
```

### Health Tracking Endpoints

```
GET    /api/health/status          - Status kesehatan pengguna
POST   /api/health/metrics         - Tambah metrik kesehatan
GET    /api/health/metrics         - Dapatkan metrik kesehatan
GET    /api/health/history         - Riwayat kesehatan
```

## Struktur Database

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Health Metrics Table

```sql
CREATE TABLE health_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    metric_type VARCHAR(50) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);
```

### Health Alerts Table

```sql
CREATE TABLE health_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    alert_type VARCHAR(50) NOT NULL,
    condition_type VARCHAR(50) NOT NULL,
    threshold_value DECIMAL(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

### Unit Tests

```bash
# Jalankan unit tests
npm run test

# Jalankan tests dengan coverage
npm run test:coverage
```

### Integration Tests

```bash
# Jalankan integration tests
npm run test:integration

# Jalankan semua tests
npm run test:all
```

### Load Testing

```bash
# Jalankan load testing dengan k6
k6 run tests/load/auth-load-test.js
```

## Deployment

### Staging

```bash
# Deploy ke staging
npm run deploy:staging
```

### Production

```bash
# Deploy ke production
npm run deploy:prod
```

### Health Checks

Service menyediakan endpoint health check di `/health` untuk monitoring:

```json
{
  "status": "healthy",
  "timestamp": "2025-06-22T10:30:00Z",
  "version": "1.0.0",
  "dependencies": {
    "database": "healthy",
    "redis": "healthy",
    "email_service": "healthy"
  }
}
```

## Monitoring dan Logging

### Metrics

- Request rate dan response time
- Error rate dan status codes
- Database connection pool
- Memory dan CPU usage
- Active user sessions

### Logging

- Authentication events (login, logout, failed attempts)
- Health data changes
- API errors dan exceptions
- Performance metrics

### Alerts

- High error rates
- Database connection issues
- Unusual authentication patterns
- System resource limits

## Security

### Authentication

- Password hashing menggunakan bcrypt
- JWT tokens dengan expiration
- Refresh token rotation
- Rate limiting untuk login attempts

### Data Protection

- Input validation dan sanitization
- SQL injection protection
- XSS protection
- CORS configuration
- Encryption untuk sensitive data

## Troubleshooting

### Common Issues

**Database Connection Failed**

```bash
# Check database status
docker-compose ps database

# Check connection string
echo $DB_HOST $DB_PORT $DB_NAME
```

**Redis Connection Failed**

```bash
# Check Redis status
redis-cli ping

# Check Redis logs
docker-compose logs redis
```

**JWT Token Issues**

```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Check token expiration
npm run check:token
```

## Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

Untuk pertanyaan atau dukungan, silakan hubungi:

- Email: dev-team@company.com
- Slack: #user-service-support
- Documentation: [Link to detailed docs]

---

**Version**: 1.0.0  
**Last Updated**: June 2025  
**Maintained by**: Development Team
