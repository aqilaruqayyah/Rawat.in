# Rawat.in – revisi fitur

## Fitur revisi
- Dashboard ringkasan barang, jadwal, biaya perawatan, dan kalender bulanan.
- Jadwal terintegrasi dengan data barang, pencarian dan filter, edit/hapus, countdown status, checklist.
- Pengulangan jadwal: 1, 3, 6, atau 12 bulan. Ketika jadwal ditandai selesai, tanggal berikutnya dihitung dan checklist direset.
- Popup pencatatan biaya dan catatan saat selesai; data dicatat pada Riwayat dan analisis biaya Dashboard.
- Riwayat perawatan dan halaman pengingat internal (H-1, hari ini, terlambat).
- Profil pengguna dan konfirmasi logout.

## Instalasi
1. Extract ZIP.
2. Frontend: `npm install`, kemudian `npm run dev`.
3. PostgreSQL: jalankan `docker compose up -d postgres` (pastikan Docker aktif).
4. Backend: masuk folder `backend`, copy `.env.example` ke `.env` dan isi konfigurasi DATABASE_URL/JWT_SECRET, lalu `npm install`.
5. Jalankan `npm run db:init` di backend untuk membuat tabel dan menambahkan kolom revisi (aman untuk kolom yang sudah ada menggunakan IF NOT EXISTS).
6. Jalankan backend dengan `npm run dev` di folder backend.
7. Buka alamat frontend Vite yang ditampilkan terminal.

API health check: `http://localhost:4000/api/health`.
Root backend `/` bukan halaman frontend dan bisa menampilkan Cannot GET /; gunakan health check di atas.
