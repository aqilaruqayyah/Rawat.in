# Rawat.in — Frontend + Backend Starter Terintegrasi

Project React + Vite untuk frontend dan Express API + PostgreSQL untuk backend.

## Struktur

- `src/`: frontend React/Vite (dashboard, barang, jadwal, riwayat, auth)
- `backend/src`: Express API, auth JWT, routes
- `backend/db/schema.sql`: schema PostgreSQL
- `backend/scripts/init-db.js`: inisialisasi schema
- `public/sw.js`: service worker notifikasi browser

## Persyaratan

Node.js 20+ (disarankan), PostgreSQL 14+.

## 1. Konfigurasi database

Buat database PostgreSQL, misalnya `rawatin`, lalu konfigurasi:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` dan isi `DATABASE_URL`, `JWT_SECRET`, `CLIENT_ORIGIN`. Buat JWT_SECRET panjang dan acak. Jalankan:

```bash
npm install
npm run db:init
npm run dev
```

Backend tersedia di `http://localhost:4000`. Cek `http://localhost:4000/api/health`.

## 2. Frontend

Dari root proyek:

```bash
cp .env.example .env
npm install
npm run dev
```

Frontend default memanggil `http://localhost:4000/api`. Jika API ada di alamat berbeda, set `VITE_API_URL` di `.env` lalu restart Vite.

## 3. Notifikasi Push

Push notifications membutuhkan HTTPS pada deployment (localhost diperbolehkan untuk pengembangan), VAPID keys, permission browser, service worker dan backend.

Generate key pair:

```bash
cd backend
npx web-push generate-vapid-keys
```

Masukkan public/private key ke `backend/.env` sebagai `VAPID_PUBLIC_KEY` dan `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (mailto), dan public key ke frontend `.env` sebagai `VITE_PUSH_PUBLIC_KEY`. Restart frontend/backend. Aktifkan notifikasi di halaman Jadwal.

Job pengingat dijalankan setiap hari pukul 08.00 berdasarkan timezone server dan mengecek jadwal hari ini/besok. Atur timezone server sesuai kebutuhan. Push hanya akan dikirim jika subscription tersimpan dan VAPID dikonfigurasi.

## API

- `POST /api/auth/register` — nama, email, password (min. 8 karakter)
- `POST /api/auth/login` — email/password
- `GET /api/auth/me` — data token saat ini
- `GET /api/items`, `POST /api/items`, `PUT /api/items/:id`, `DELETE /api/items/:id`
- `GET /api/history`, `POST /api/history`
- `POST /api/notifications/subscribe`, `DELETE /api/notifications/subscribe`
- `GET /api/health`

Protected routes memakai `Authorization: Bearer <token>`. Data barang dan riwayat dipisahkan per pemilik.

## Catatan deployment

- Deploy frontend dan API terpisah; atur `CLIENT_ORIGIN` dan `VITE_API_URL` sesuai domain.
- Push notifications memerlukan HTTPS, bukan HTTP biasa pada domain production.
- Jangan commit `.env` atau secrets.
- Tambahkan backup DB, HTTPS, rate limiting, monitoring, dan review keamanan sebelum aplikasi digunakan publik/production.

## Opsi database dengan Docker

Jika Docker sudah terpasang, jalankan `docker compose up -d postgres` dari root. Ini membuat PostgreSQL lokal (password contoh di compose file harus diganti untuk penggunaan nyata). Setelah database aktif, backend `.env` bisa memakai:

`DATABASE_URL=postgresql://postgres:change-this-password@localhost:5432/rawatin`
