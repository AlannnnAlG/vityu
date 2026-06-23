/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("blog");

  const record0 = new Record(collection);
    record0.set("judul", "5 Tips Perawatan Kulit Harian untuk Kulit Sehat");
    record0.set("slug", "5-tips-perawatan-kulit-harian");
    record0.set("konten", "Perawatan kulit yang konsisten adalah kunci untuk mendapatkan kulit yang sehat dan bercahaya. Berikut adalah 5 tips penting yang harus Anda lakukan setiap hari: 1. Bersihkan wajah dua kali sehari, 2. Gunakan toner untuk menyeimbangkan pH, 3. Aplikasikan serum sesuai kebutuhan kulit, 4. Gunakan moisturizer yang tepat, 5. Jangan lupa sunscreen di pagi hari.");
    record0.set("excerpt", "Pelajari 5 tips perawatan kulit harian yang mudah dan efektif untuk kulit sehat");
    record0.set("kategori", "tips");
    record0.set("tags", "skincare, perawatan-kulit, tips-kecantikan");
    record0.set("status", "published");
    record0.set("meta_description", "5 tips perawatan kulit harian untuk kulit sehat dan bercahaya");
    const record0_author_idLookup = app.findFirstRecordByFilter("users", "email='admin@vityuu.com'");
    if (!record0_author_idLookup) { throw new Error("Lookup failed for author_id: no record in 'users' matching \"email='admin@vityuu.com'\""); }
    record0.set("author_id", record0_author_idLookup.id);
  try {
    app.save(record0);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record1 = new Record(collection);
    record1.set("judul", "Tutorial Makeup Natural untuk Pemula");
    record1.set("slug", "tutorial-makeup-natural-pemula");
    record1.set("konten", "Makeup natural adalah tren yang sedang populer saat ini. Dalam tutorial ini, kami akan mengajarkan Anda cara membuat makeup natural yang cantik dan tahan lama. Langkah-langkahnya: 1. Aplikasikan primer, 2. Gunakan foundation yang sesuai, 3. Aplikasikan blush on secara tipis, 4. Gunakan eyeshadow warna netral, 5. Aplikasikan mascara dan lipstik nude.");
    record1.set("excerpt", "Panduan lengkap makeup natural untuk pemula dengan hasil yang cantik");
    record1.set("kategori", "tutorial");
    record1.set("tags", "makeup, tutorial-makeup, natural-makeup");
    record1.set("status", "published");
    record1.set("meta_description", "Tutorial makeup natural untuk pemula - panduan lengkap");
    const record1_author_idLookup = app.findFirstRecordByFilter("users", "email='admin@vityuu.com'");
    if (!record1_author_idLookup) { throw new Error("Lookup failed for author_id: no record in 'users' matching \"email='admin@vityuu.com'\""); }
    record1.set("author_id", record1_author_idLookup.id);
  try {
    app.save(record1);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record2 = new Record(collection);
    record2.set("judul", "Tren Kecantikan 2024 yang Harus Anda Ketahui");
    record2.set("slug", "tren-kecantikan-2024");
    record2.set("konten", "Tahun 2024 membawa berbagai tren kecantikan baru yang menarik. Dari skincare minimalis hingga makeup bold, berikut adalah tren-tren yang sedang viral: 1. Glass skin trend, 2. Clean beauty products, 3. Bold eyebrows, 4. Dewy makeup, 5. Sustainable beauty brands.");
    record2.set("excerpt", "Temukan tren kecantikan terbaru tahun 2024 yang sedang viral");
    record2.set("kategori", "news");
    record2.set("tags", "tren-kecantikan, 2024, beauty-trends");
    record2.set("status", "published");
    record2.set("meta_description", "Tren kecantikan 2024 yang harus Anda ketahui");
    const record2_author_idLookup = app.findFirstRecordByFilter("users", "email='admin@vityuu.com'");
    if (!record2_author_idLookup) { throw new Error("Lookup failed for author_id: no record in 'users' matching \"email='admin@vityuu.com'\""); }
    record2.set("author_id", record2_author_idLookup.id);
  try {
    app.save(record2);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record3 = new Record(collection);
    record3.set("judul", "Review: Facial Cleanser Gentle dari Vityuu");
    record3.set("slug", "review-facial-cleanser-gentle");
    record3.set("konten", "Kami telah mencoba Facial Cleanser Gentle dari Vityuu selama 2 minggu. Produk ini memiliki tekstur yang lembut dan tidak membuat kulit terasa kering. Formula yang mengandung aloe vera extract sangat menenangkan untuk kulit sensitif. Hasilnya, kulit terasa lebih bersih dan segar tanpa efek samping.");
    record3.set("excerpt", "Review jujur tentang Facial Cleanser Gentle dari Vityuu");
    record3.set("kategori", "review");
    record3.set("tags", "review-produk, facial-cleanser, skincare");
    record3.set("status", "published");
    record3.set("meta_description", "Review Facial Cleanser Gentle dari Vityuu");
    const record3_author_idLookup = app.findFirstRecordByFilter("users", "email='admin@vityuu.com'");
    if (!record3_author_idLookup) { throw new Error("Lookup failed for author_id: no record in 'users' matching \"email='admin@vityuu.com'\""); }
    record3.set("author_id", record3_author_idLookup.id);
  try {
    app.save(record3);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record4 = new Record(collection);
    record4.set("judul", "Cara Memilih Produk Skincare yang Tepat untuk Jenis Kulit Anda");
    record4.set("slug", "cara-memilih-skincare-jenis-kulit");
    record4.set("konten", "Memilih produk skincare yang tepat sangat penting untuk hasil yang optimal. Setiap jenis kulit memiliki kebutuhan yang berbeda. Untuk kulit berminyak, pilih produk yang oil-free dan non-comedogenic. Untuk kulit kering, pilih produk yang kaya akan moisturizer. Untuk kulit sensitif, hindari produk dengan bahan kimia keras.");
    record4.set("excerpt", "Panduan memilih produk skincare yang sesuai dengan jenis kulit Anda");
    record4.set("kategori", "tips");
    record4.set("tags", "skincare, jenis-kulit, tips-memilih");
    record4.set("status", "published");
    record4.set("meta_description", "Cara memilih skincare yang tepat untuk jenis kulit Anda");
    const record4_author_idLookup = app.findFirstRecordByFilter("users", "email='admin@vityuu.com'");
    if (!record4_author_idLookup) { throw new Error("Lookup failed for author_id: no record in 'users' matching \"email='admin@vityuu.com'\""); }
    record4.set("author_id", record4_author_idLookup.id);
  try {
    app.save(record4);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }
}, (app) => {
  // Rollback: record IDs not known, manual cleanup needed
})
