/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("blog");

  const record0 = new Record(collection);
    record0.set("judul", "10 Skincare Tips untuk Kulit Tropis");
    record0.set("slug", "10-skincare-tips-kulit-tropis");
    record0.set("konten", "Kulit tropis membutuhkan perawatan khusus karena kelembaban tinggi dan paparan sinar matahari yang intens. Berikut adalah 10 tips skincare yang efektif untuk menjaga kesehatan kulit Anda di iklim tropis. Pertama, gunakan sunscreen dengan SPF minimal 30 setiap hari. Kedua, pilih produk yang ringan dan tidak terlalu berat untuk menghindari pori-pori tersumbat.");
    record0.set("excerpt", "Panduan lengkap perawatan kulit untuk iklim tropis dengan tips praktis dan produk yang tepat.");
    record0.set("kategori", "tips");
    record0.set("tags", "skincare, kulit-tropis, perawatan-kulit");
    record0.set("status", "published");
    record0.set("meta_description", "Pelajari 10 tips skincare terbaik untuk kulit tropis dengan panduan lengkap dari ahli kecantikan.");
    const record0_author_idLookup = app.findFirstRecordByFilter("users", "email='admin1@beautyshop.com'");
    if (!record0_author_idLookup) { throw new Error("Lookup failed for author_id: no record in 'users' matching \"email='admin1@beautyshop.com'\""); }
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
    record1.set("konten", "Makeup natural adalah tren yang sedang populer dan cocok untuk pemula. Dalam tutorial ini, kami akan mengajarkan langkah-langkah dasar untuk menciptakan tampilan makeup yang natural dan fresh. Mulai dari persiapan kulit, pemilihan foundation yang tepat, hingga teknik blending yang sempurna. Dengan mengikuti panduan ini, Anda akan dapat membuat makeup natural yang tahan lama.");
    record1.set("excerpt", "Panduan step-by-step makeup natural untuk pemula dengan produk yang mudah ditemukan.");
    record1.set("kategori", "tutorial");
    record1.set("tags", "makeup, natural-makeup, tutorial-makeup");
    record1.set("status", "published");
    record1.set("meta_description", "Tutorial makeup natural lengkap untuk pemula dengan tips dan trik dari makeup artist profesional.");
    const record1_author_idLookup = app.findFirstRecordByFilter("users", "email='admin1@beautyshop.com'");
    if (!record1_author_idLookup) { throw new Error("Lookup failed for author_id: no record in 'users' matching \"email='admin1@beautyshop.com'\""); }
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
    record2.set("judul", "Tren Kecantikan 2026: Apa yang Harus Anda Ketahui");
    record2.set("slug", "tren-kecantikan-2026");
    record2.set("konten", "Tahun 2026 membawa berbagai tren kecantikan baru yang menarik dan inovatif. Dari skincare minimalis hingga makeup bold, ada banyak pilihan untuk mengekspresikan gaya Anda. Tren utama tahun ini adalah fokus pada kesehatan kulit alami, penggunaan bahan-bahan organik, dan makeup yang sustainable. Kami akan membahas setiap tren secara detail dan memberikan rekomendasi produk terbaik.");
    record2.set("excerpt", "Jelajahi tren kecantikan terbaru tahun 2026 dan temukan gaya yang paling sesuai untuk Anda.");
    record2.set("kategori", "news");
    record2.set("tags", "tren-kecantikan, 2026, beauty-trends");
    record2.set("status", "published");
    record2.set("meta_description", "Tren kecantikan 2026 yang paling dinanti-nantikan dengan rekomendasi produk dan tips styling.");
    const record2_author_idLookup = app.findFirstRecordByFilter("users", "email='admin2@beautyshop.com'");
    if (!record2_author_idLookup) { throw new Error("Lookup failed for author_id: no record in 'users' matching \"email='admin2@beautyshop.com'\""); }
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
    record3.set("judul", "Review Produk: Facial Cleanser Terbaik untuk Kulit Sensitif");
    record3.set("slug", "review-facial-cleanser-kulit-sensitif");
    record3.set("konten", "Memilih facial cleanser yang tepat untuk kulit sensitif sangat penting untuk menjaga kesehatan kulit. Kami telah menguji berbagai produk dan menemukan beberapa yang paling efektif dan aman untuk kulit sensitif. Produk-produk ini telah teruji dermatologi dan tidak mengandung bahan-bahan yang dapat mengiritasi kulit. Baca review lengkap kami untuk menemukan produk yang paling sesuai dengan kebutuhan Anda.");
    record3.set("excerpt", "Review mendalam tentang facial cleanser terbaik yang aman untuk kulit sensitif dan berjerawat.");
    record3.set("kategori", "review");
    record3.set("tags", "review-produk, facial-cleanser, kulit-sensitif");
    record3.set("status", "published");
    record3.set("meta_description", "Review lengkap facial cleanser terbaik untuk kulit sensitif dengan perbandingan harga dan kualitas.");
    const record3_author_idLookup = app.findFirstRecordByFilter("users", "email='admin2@beautyshop.com'");
    if (!record3_author_idLookup) { throw new Error("Lookup failed for author_id: no record in 'users' matching \"email='admin2@beautyshop.com'\""); }
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
    record4.set("judul", "Cara Merawat Rambut Keriting Agar Tetap Sehat");
    record4.set("slug", "cara-merawat-rambut-keriting");
    record4.set("konten", "Rambut keriting memerlukan perawatan khusus untuk menjaga kelembutan dan kilau alaminya. Dalam artikel ini, kami akan membagikan tips dan trik untuk merawat rambut keriting dengan benar. Mulai dari pemilihan shampoo dan conditioner yang tepat, teknik pengeringan yang benar, hingga treatment mingguan yang dapat dilakukan di rumah. Dengan perawatan yang tepat, rambut keriting Anda akan terlihat lebih sehat dan indah.");
    record4.set("excerpt", "Panduan lengkap perawatan rambut keriting dengan produk dan teknik yang terbukti efektif.");
    record4.set("kategori", "tips");
    record4.set("tags", "haircare, rambut-keriting, perawatan-rambut");
    record4.set("status", "draft");
    record4.set("meta_description", "Tips perawatan rambut keriting yang efektif untuk hasil maksimal dan rambut yang sehat bercahaya.");
    const record4_author_idLookup = app.findFirstRecordByFilter("users", "email='admin1@beautyshop.com'");
    if (!record4_author_idLookup) { throw new Error("Lookup failed for author_id: no record in 'users' matching \"email='admin1@beautyshop.com'\""); }
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

  const record5 = new Record(collection);
    record5.set("judul", "Bodycare Routine untuk Kulit Kering");
    record5.set("slug", "bodycare-routine-kulit-kering");
    record5.set("konten", "Kulit kering di tubuh memerlukan perhatian khusus dan routine yang konsisten. Artikel ini akan memandu Anda melalui langkah-langkah untuk membuat bodycare routine yang efektif untuk kulit kering. Kami akan membahas pentingnya exfoliating, moisturizing, dan penggunaan body oil untuk hasil maksimal. Dengan mengikuti routine ini secara teratur, kulit tubuh Anda akan menjadi lebih lembut dan terhidrasi.");
    record5.set("excerpt", "Routine bodycare lengkap untuk mengatasi kulit kering dengan produk yang tepat dan efektif.");
    record5.set("kategori", "tutorial");
    record5.set("tags", "bodycare, kulit-kering, moisturizing");
    record5.set("status", "draft");
    record5.set("meta_description", "Bodycare routine untuk kulit kering dengan langkah-langkah mudah dan produk yang recommended.");
    const record5_author_idLookup = app.findFirstRecordByFilter("users", "email='admin1@beautyshop.com'");
    if (!record5_author_idLookup) { throw new Error("Lookup failed for author_id: no record in 'users' matching \"email='admin1@beautyshop.com'\""); }
    record5.set("author_id", record5_author_idLookup.id);
  try {
    app.save(record5);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record6 = new Record(collection);
    record6.set("judul", "Ingredients Skincare yang Harus Dihindari untuk Kulit Sensitif");
    record6.set("slug", "ingredients-skincare-hindari-kulit-sensitif");
    record6.set("konten", "Banyak bahan skincare yang dapat menyebabkan iritasi pada kulit sensitif. Dalam artikel ini, kami akan mengidentifikasi ingredients yang harus dihindari dan menjelaskan mengapa mereka dapat berbahaya bagi kulit sensitif. Kami juga akan memberikan alternatif yang lebih aman dan efektif untuk menggantikan bahan-bahan tersebut. Dengan pengetahuan ini, Anda dapat memilih produk skincare yang lebih aman untuk kulit Anda.");
    record6.set("excerpt", "Daftar lengkap ingredients skincare yang harus dihindari untuk kulit sensitif dan alternatif yang aman.");
    record6.set("kategori", "tips");
    record6.set("tags", "skincare, kulit-sensitif, ingredients");
    record6.set("status", "draft");
    record6.set("meta_description", "Panduan ingredients skincare yang harus dihindari untuk kulit sensitif dengan alternatif yang aman.");
    const record6_author_idLookup = app.findFirstRecordByFilter("users", "email='admin2@beautyshop.com'");
    if (!record6_author_idLookup) { throw new Error("Lookup failed for author_id: no record in 'users' matching \"email='admin2@beautyshop.com'\""); }
    record6.set("author_id", record6_author_idLookup.id);
  try {
    app.save(record6);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record7 = new Record(collection);
    record7.set("judul", "Makeup untuk Acara Formal: Panduan Lengkap");
    record7.set("slug", "makeup-acara-formal-panduan");
    record7.set("konten", "Makeup untuk acara formal memerlukan teknik dan produk yang berbeda dari makeup sehari-hari. Panduan ini akan mengajarkan Anda cara membuat makeup yang elegan dan tahan lama untuk acara formal. Kami akan membahas pemilihan warna yang tepat, teknik contouring, dan cara mengaplikasikan makeup agar terlihat sempurna di bawah cahaya. Dengan mengikuti panduan ini, Anda akan tampil percaya diri di setiap acara formal.");
    record7.set("excerpt", "Panduan lengkap makeup untuk acara formal dengan tips profesional dan produk yang recommended.");
    record7.set("kategori", "tutorial");
    record7.set("tags", "makeup, acara-formal, makeup-tutorial");
    record7.set("status", "draft");
    record7.set("meta_description", "Tutorial makeup untuk acara formal dengan langkah-langkah detail dan tips dari makeup artist profesional.");
    const record7_author_idLookup = app.findFirstRecordByFilter("users", "email='admin2@beautyshop.com'");
    if (!record7_author_idLookup) { throw new Error("Lookup failed for author_id: no record in 'users' matching \"email='admin2@beautyshop.com'\""); }
    record7.set("author_id", record7_author_idLookup.id);
  try {
    app.save(record7);
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
