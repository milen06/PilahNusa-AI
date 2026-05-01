# Pure Node.js Inference Strategy

Terima kasih atas model versi terbarunya (`pilahnusa_model_finalv2.tflite`). Saya melihat ukuran modelnya sudah jauh lebih kecil dan efisien (34.8 MB)!

Namun, **inti masalahnya bukan pada isi file modelnya**, melainkan pada pustaka pembaca `.tflite` di Node.js (`@tensorflow/tfjs-tflite`) yang secara teknis *rusak* jika dijalankan di luar lingkungan Browser.

Untuk memenuhi impian Anda memiliki **arsitektur JavaScript Murni tanpa Python**, kita harus mengonversi model ini menjadi format **TensorFlow.js Graph Model** (`model.json`).

## User Review Required

> [!IMPORTANT]
> **Langkah Konversi**
> 
> Karena paket `tflite` rusak di Node.js, kita tidak akan menggunakan `tflite` sama sekali. Kita akan:
> 1. Mengonversi `pilahnusa_model_finalv2.tflite` menjadi format Web standar JS (terdiri dari file `model.json` dan `.bin`).
> 2. Memuat model tersebut di *Controller* menggunakan pustaka `@tensorflow/tfjs` standar.
> 
> Keuntungannya: Tidak perlu Python, tidak butuh instalasi C++ (*Build Tools*), dan berjalan 100% menggunakan kode JavaScript murni di backend Node.js Anda!

## Open Questions

Apakah Anda setuju jika saya mengeksekusi konversi file ini secara otomatis sekarang, dan menghapus sisa-sisa script Python yang ada?

## Proposed Changes

1. **Konversi Model (Background)**:
   - Saya akan menggunakan alat konverter di terminal untuk mengubah `pilahnusa_model_finalv2.tflite` ke folder `server/data/tfjs_model/`.

2. **Controller Refactoring (`classificationController.js`)**:
   - Menghapus pemanggilan `child_process.spawn('python')`.
   - Mengimpor `@tensorflow/tfjs`.
   - Menggunakan `tf.node.decodeImage(buffer)` dan `tf.image.resizeBilinear` persis seperti yang Anda minta sebelumnya.
   - Melakukan prediksi murni di dalam Node.js.

3. **Pembersihan Akhir**:
   - Menghapus folder `server/python/` dan *script* lama karena tidak akan dibutuhkan lagi.
