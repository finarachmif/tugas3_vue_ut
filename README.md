# SITTA - Tugas Praktik 3 Vue.js

## Menjalankan di vscode.dev
1. Ekstrak folder `tugas3-vue-ut`.
2. Buka https://vscode.dev.
3. Pilih **File > Open Folder...** lalu pilih folder `tugas3-vue-ut` (atau unggah folder ke repository GitHub lalu buka repository tersebut di vscode.dev).
4. Edit file sesuai kebutuhan.

**Penting:** vscode.dev adalah editor kode di browser, bukan web server dan tidak menyediakan terminal lokal secara default. Untuk menjalankan aplikasi yang memakai `fetch()` ke JSON, publikasikan folder ke GitHub Pages atau buka repository di GitHub Codespaces dan jalankan server web. Jangan membuka `index.html` langsung dengan `file://` karena browser dapat memblokir pembacaan JSON.

## Menjalankan melalui GitHub Pages
1. Buat repository GitHub, unggah seluruh isi folder proyek (index.html harus berada di root repository).
2. Buka **Settings > Pages**.
3. Pada Build and deployment, pilih **Deploy from a branch**, pilih branch `main` dan folder `/ (root)`, lalu Save.
4. Tunggu proses deployment selesai, kemudian buka URL GitHub Pages yang diberikan GitHub.

Vue 2.7.16 dimuat melalui CDN sehingga koneksi internet diperlukan saat aplikasi dibuka.

## Catatan implementasi
- Data awal dibaca dari `data/dataBahanAjar.json`.
- Perubahan data CRUD berjalan di memori browser selama halaman terbuka. Karena tugas tidak menggunakan backend/database, perubahan akan kembali ke data JSON awal setelah halaman di-refresh.
- Vue 2 digunakan karena instruksi tugas memberi contoh `Vue.component(...)`.
- Komponen memiliki template inline di file JavaScript agar tidak memerlukan proses build. Folder `templates/` disediakan mengikuti struktur soal sebagai referensi template terpisah.
- Dua watcher atau lebih diterapkan pada komponen stok, tracking, dan formulir order.
- Nomor DO dibentuk otomatis dengan format `DOYYYY-001`.
