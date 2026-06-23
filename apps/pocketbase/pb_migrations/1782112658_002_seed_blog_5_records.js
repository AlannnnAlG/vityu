/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("blog");

  const record0 = new Record(collection);
    record0.set("judul", "10 Tips Perawatan Kulit Harian untuk Kulit Sehat");
    record0.set("slug", "10-tips-perawatan-kulit-harian");
    record0.set("konten", "Perawatan kulit yang tepat adalah kunci untuk memiliki kulit yang sehat dan bercahaya. Dalam artikel ini, kami akan membagikan 10 tips perawatan kulit harian yang dapat Anda lakukan di rumah. Mulai dari membersihkan wajah dengan benar, menggunakan toner, hingga mengaplikasikan moisturizer yang sesuai dengan jenis kulit Anda.");
    record0.set("excerpt", "Pelajari 10 tips perawatan kulit harian yang mudah dan efektif untuk kulit sehat.");
    record0.set("kategori", "tips");
    record0.set("status", "published");
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
    record1.set("konten", "Makeup natural adalah tren yang sedang populer saat ini. Jika Anda pemula dan ingin belajar makeup natural, artikel ini akan memandu Anda langkah demi langkah. Kami akan menjelaskan produk-produk yang diperlukan, teknik aplikasi, dan tips untuk membuat makeup Anda terlihat natural namun tetap cantik.");
    record1.set("excerpt", "Panduan lengkap makeup natural untuk pemula dengan langkah-langkah mudah.");
    record1.set("kategori", "tutorial");
    record1.set("status", "published");
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
    record2.set("judul", "Tren Skincare 2024 yang Harus Anda Coba");
    record2.set("slug", "tren-skincare-2024");
    record2.set("konten", "Tahun 2024 membawa berbagai tren skincare baru yang menarik. Dari glass skin hingga clean beauty, ada banyak pilihan untuk meningkatkan rutinitas perawatan kulit Anda. Artikel ini akan membahas tren-tren terbaru dan bagaimana cara mengimplementasikannya dalam kehidupan sehari-hari.");
    record2.set("excerpt", "Jelajahi tren skincare terbaru tahun 2024 dan cara menggunakannya.");
    record2.set("kategori", "news");
    record2.set("status", "published");
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
    record3.set("judul", "Review Produk Skincare Terbaik Bulan Ini");
    record3.set("slug", "review-produk-skincare-terbaik");
    record3.set("konten", "Kami telah menguji berbagai produk skincare terbaru dan ingin berbagi review jujur dengan Anda. Produk-produk ini telah terbukti efektif dalam meningkatkan kualitas kulit. Baca review lengkap kami untuk mengetahui produk mana yang paling cocok untuk kebutuhan kulit Anda.");
    record3.set("excerpt", "Review mendalam tentang produk skincare terbaik dengan hasil nyata.");
    record3.set("kategori", "review");
    record3.set("status", "published");
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
    record4.set("judul", "Cara Mengatasi Jerawat dengan Bahan Alami");
    record4.set("slug", "cara-mengatasi-jerawat-bahan-alami");
    record4.set("konten", "Jerawat adalah masalah kulit yang umum dialami banyak orang. Jika Anda mencari solusi alami tanpa efek samping, artikel ini akan memberikan berbagai cara mengatasi jerawat menggunakan bahan-bahan alami. Dari masker madu hingga tea tree oil, semua bahan ini mudah ditemukan dan terbukti efektif.");
    record4.set("excerpt", "Solusi alami untuk mengatasi jerawat dengan bahan-bahan yang mudah ditemukan.");
    record4.set("kategori", "tips");
    record4.set("status", "published");
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
