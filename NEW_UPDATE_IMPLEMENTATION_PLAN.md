# Implementation Plan: Update Hasil Analisis AI — Waste Classifier (Next.js)

## Overview

Dokumen ini berisi panduan implementasi untuk memperbarui tampilan **Hasil Klasifikasi Sampah** pada frontend dan backend aplikasi Next.js, berdasarkan data referensi tabel sampah yang telah didefinisikan. Tidak ada kode dalam dokumen ini — hanya guideline dan arah implementasi.

---

## 1. Perubahan Data Model

### Tujuan
Memperluas struktur data hasil klasifikasi agar mencakup semua informasi dari tabel referensi, bukan hanya label dan confidence score.

### Yang Perlu Didefinisikan
- Tipe data `WasteItem` mencakup: label kelas, kategori (Anorganik/Organik/B3), waktu terurai, potensi daur ulang, instruksi penanganan, dampak jika salah kelola, nilai ekonomi, cara pembuangan, dan tips daur ulang.
- Tipe data `ClassificationResult` sebagai wrapper yang menggabungkan `WasteItem` dengan metadata scan (URL gambar, confidence score, timestamp).
- Enum atau union type untuk kategori dan nilai ekonomi agar konsisten di seluruh aplikasi.

### File yang Dibuat
- `types/waste.ts` — semua definisi tipe data

---

## 2. Perubahan Backend

### 2.1 Database Referensi Sampah

#### Tujuan
Menyediakan satu sumber kebenaran (single source of truth) untuk seluruh data 10 jenis sampah dari tabel referensi.

#### Yang Perlu Dilakukan
- Buat file `lib/wasteData.ts` berisi array lengkap 10 item sampah sesuai tabel:
  - Anorganik: Botol Plastik (PET), Plastik (HDPE/PP), Kaca, Metal (Kaleng), Pakaian/Tekstil
  - Organik: Karbohidrat, Sisa Buah & Sayur, Kertas & Kardus, Vegetasi (Daun/Ranting)
  - B3: Baterai
- Sertakan helper function untuk mencari item berdasarkan ID atau label hasil AI.
- Sertakan link referensi eksternal sesuai tabel sebagai metadata.

---

### 2.2 Update API Route `/api/classify`

#### Tujuan
Menghubungkan output model AI (berupa label teks) dengan data referensi yang lengkap.

#### Yang Perlu Dilakukan
- Setelah model AI mengembalikan label dan confidence, lakukan lookup ke `wasteData` berdasarkan label tersebut.
- Jika label tidak ditemukan di database, kembalikan error yang informatif.
- Response API harus mengembalikan objek `ClassificationResult` lengkap, bukan hanya label mentah dari model.
- Tambahkan validasi input (pastikan gambar ada dan formatnya valid).
- Pertimbangkan menyimpan riwayat scan ke database jika fitur "Lihat Riwayat" dibutuhkan.

---

## 3. Perubahan Frontend

### 3.1 Arsitektur Komponen

#### Tujuan
Memecah halaman hasil klasifikasi menjadi komponen-komponen kecil yang bisa dirawat dan diuji secara terpisah.

#### Komponen yang Perlu Dibuat

| Komponen | Fungsi |
|---|---|
| `ClassificationResultCard` | Komponen utama yang merakit semua sub-komponen |
| `CategoryBadge` | Badge warna sesuai kategori (Anorganik/Organik/B3) |
| `ConfidenceBar` | Progress bar persentase keyakinan AI |
| `WasteStats` | Menampilkan waktu terurai, nilai ekonomi, potensi daur ulang |
| `DisposalInfo` | Cara pembuangan yang benar dan dampak jika salah kelola |
| `RecyclingTips` | Daftar tips daur ulang |

---

### 3.2 Halaman Hasil — `app/result/page.tsx`

#### Yang Perlu Dilakukan
- Ambil data `ClassificationResult` dari state management atau localStorage setelah proses scan.
- Tampilkan loading state saat menunggu respons API.
- Tampilkan error state jika hasil tidak ditemukan atau API gagal.
- Render `ClassificationResultCard` dengan data hasil klasifikasi.

---

### 3.3 Panduan Tampilan Per Komponen

#### `CategoryBadge`
- Gunakan warna berbeda untuk tiap kategori: biru untuk Anorganik, hijau untuk Organik, merah untuk B3.
- Tampilkan ikon dan teks kategori.

#### `ConfidenceBar`
- Bar berwarna hijau yang terisi sesuai persentase confidence.
- Tampilkan angka persentase di kanan bar.

#### `WasteStats`
- Tampilkan waktu terurai dengan ikon jam.
- Tampilkan nilai ekonomi (Rendah/Sedang/Tinggi/Sangat Tinggi).
- Tampilkan daftar potensi daur ulang.

#### `DisposalInfo`
- Pisahkan dengan jelas antara instruksi pembuangan dan peringatan dampak.
- Gunakan ikon peringatan untuk bagian dampak jika salah kelola.

#### `RecyclingTips`
- Tampilkan sebagai daftar dengan ikon centang hijau.
- Sesuaikan tips berdasarkan data dari `wasteItem.tipsDaurUlang`.

---

## 4. Checklist Implementasi

### Backend
- [ ] Buat `types/waste.ts`
- [ ] Buat `lib/wasteData.ts` dengan 10 item lengkap
- [ ] Update API route untuk mapping label AI → `WasteItem`
- [ ] Tambahkan error handling dan validasi input
- [ ] (Opsional) Simpan riwayat ke database

### Frontend
- [ ] Buat komponen `ClassificationResultCard`
- [ ] Buat semua sub-komponen pendukung
- [ ] Update `app/result/page.tsx`
- [ ] Tambahkan loading dan error state
- [ ] Pastikan tampilan konsisten untuk semua 10 kategori sampah

### Testing
- [ ] Unit test untuk helper function di `wasteData.ts`
- [ ] Integration test untuk API route `/api/classify`
- [ ] Visual test untuk semua kategori (Anorganik, Organik, B3)
- [ ] Test edge case: label tidak dikenali, confidence rendah, gambar tidak valid

---

## 5. Struktur Folder Akhir

```
├── app/
│   ├── api/
│   │   └── classify/
│   │       └── route.ts          ← diperbarui
│   └── result/
│       └── page.tsx              ← diperbarui
├── components/
│   ├── ClassificationResult.tsx  ← baru
│   ├── CategoryBadge.tsx         ← baru
│   ├── ConfidenceBar.tsx         ← baru
│   ├── DisposalInfo.tsx          ← baru
│   ├── RecyclingTips.tsx         ← baru
│   └── WasteStats.tsx            ← baru
├── lib/
│   └── wasteData.ts              ← baru
└── types/
    └── waste.ts                  ← baru
```

---

## 6. Referensi Data

1. [National Geographic — Plastic Pollution](https://www.nationalgeographic.com/environment/article/plastic-pollution)
2. [Waste4Change — Waktu Terurai Sampah](https://waste4change.com/blog/mengapa-sampah-organik-dan-anorganik-dibedakan-berdasarkan-waktu-terurai/)
3. [Zero Waste ID — Cara Memilah Sampah](https://zerowaste.id/zero-waste-lifestyle/cara-memilah-sampah-di-rumah/)