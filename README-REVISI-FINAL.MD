# Rawat.in - Revisi perbaikan

Revisi ini memuat perbaikan sintaks pada `src/App.jsx`, navigasi profil, formulir profil dan ubah password, kalender interaktif dengan detail tanggal, checklist, pencarian/filter jadwal, interval perawatan, riwayat dan biaya, serta penyegaran tampilan.

## Menjalankan aplikasi

1. Extract ZIP, lalu buka folder `rawat-in` di VS Code.
2. Jalankan PostgreSQL (Docker) dari folder proyek: `docker compose up -d postgres`.
3. Pastikan `backend/.env` berisi `DATABASE_URL` dengan password PostgreSQL yang benar. Contoh format: `postgresql://postgres:PASSWORD_SEBENARNYA@localhost:5432/rawatin`. Jangan membagikan password.
4. Dari terminal folder backend, jalankan `npm install`, lalu `npm run db:init`, kemudian `npm run dev`.
5. Dari terminal folder frontend, jalankan `npm install`, lalu `npm run dev`.
6. Buka `http://localhost:5173`.

API health check: `http://localhost:4000/api/health`.

## Catatan

Build penuh belum dapat diverifikasi dalam lingkungan pembuat ZIP karena pemasangan dependency npm mengalami timeout. Uji kembali di komputer lokal. Jangan hapus database lama; inisialisasi schema menggunakan perintah SQL yang mempertahankan tabel/data yang sudah ada.
