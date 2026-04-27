# Personnel Leave Request System

Personel izin talep sistemi. Express + React + PostgreSQL.

Backend tarafında TypeScript, Prisma ORM, JWT authentication, Zod validation kullanılıyor.
Frontend tarafında React 18, Vite, Tailwind CSS var.

Sistemde 3 rol var:
- Manager (1): Kullanıcıları onaylar/reddeder, izin taleplerini yönetir
- Employee (2): İzin talebi oluşturur, kendi taleplerini görür
- PendingUser (3): Yeni kayıt olan kullanıcı, onay bekliyor

Kayıt olan herkes PendingUser olarak başlar. Manager onayladığında Employee olur ve izin talebi oluşturabilir.

Backend katmanlı mimari kullanıyor: Controller -> Service -> Repository.
İş mantığı service katmanında, veritabanı sorguları repository katmanında.

## Kurulum

Docker Desktop kurulu olmalı.

Önce örnek ortam dosyasını kopyalayın:

```bash
cp .env.example .env
```

`.env` içindeki değerleri kendi local ortamınıza göre düzenleyebilirsiniz. Özellikle ilk yönetici hesabı için şu alanlar kullanılır:

```txt
ADMIN_EMAIL
ADMIN_PASSWORD
ADMIN_FULL_NAME
```

Ardından projeyi Docker ile başlatın:

```bash
docker compose up --build
```

3 container ayağa kalkar:
- postgres: veritabanı (port 5433)
- backend: Express API (port 8080)
- frontend: React + Nginx (port 3000)

İlk açılışta backend otomatik olarak migration çalıştırır, rolleri oluşturur ve `.env` içinde admin bilgileri verilmişse bir manager kullanıcı seed eder.

Admin kullanıcısı `.env` içindeki `ADMIN_EMAIL`, `ADMIN_PASSWORD` ve `ADMIN_FULL_NAME` değerleriyle oluşturulur.

Frontend: http://localhost:3000
API: http://localhost:8080/api
Swagger: http://localhost:8080/api/docs

Durdurmak: `docker compose down`
Veritabanı dahil sıfırlamak: `docker compose down -v`

## Endpoints

Auth:

POST   /api/auth/register      yeni kullanıcı kaydı
POST   /api/auth/login         giriş
GET    /api/auth/me            oturumdaki kullanıcı bilgisi


Users (manager):

GET    /api/users              tüm kullanıcılar (search, roleId, page, pageSize)
GET    /api/users/pending      onay bekleyenler
PUT    /api/users/:id/approve  kullanıcı onayla
PUT    /api/users/:id/reject   kullanıcı reddet
PUT    /api/users/:id/role     rol değiştir


Leave Requests:

POST   /api/leave-requests          izin talebi oluştur (employee)
GET    /api/leave-requests          tüm talepler (manager, search/status/page filtreli)
GET    /api/leave-requests/my       kendi taleplerim (employee)
PUT    /api/leave-requests/:id/status   onayla veya reddet (manager)
