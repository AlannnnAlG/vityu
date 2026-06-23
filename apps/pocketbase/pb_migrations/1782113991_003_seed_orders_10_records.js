/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("orders");

  const record0 = new Record(collection);
    record0.set("nomor_pesanan", "ORD-2026-001");
    const record0_user_idLookup = app.findFirstRecordByFilter("users", "email='user1@beautyshop.com'");
    if (!record0_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user1@beautyshop.com'\""); }
    record0.set("user_id", record0_user_idLookup.id);
    record0.set("items", "[{\"product_id\": \"prod_001\", \"nama_produk\": \"Facial Cleanser\", \"quantity\": 2, \"harga\": 150000}, {\"product_id\": \"prod_002\", \"nama_produk\": \"Moisturizer\", \"quantity\": 1, \"harga\": 200000}]");
    record0.set("total_harga", 500000);
    record0.set("status_pembayaran", "success");
    record0.set("status_pesanan", "delivered");
    record0.set("alamat_pengiriman", "Jl. Ahmad Yani No. 3, Surabaya, Jawa Timur 60123");
    record0.set("kurir_pengiriman", "JNE");
    record0.set("nomor_tracking", "JNE123456789");
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
    record1.set("nomor_pesanan", "ORD-2026-002");
    const record1_user_idLookup = app.findFirstRecordByFilter("users", "email='user2@beautyshop.com'");
    if (!record1_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user2@beautyshop.com'\""); }
    record1.set("user_id", record1_user_idLookup.id);
    record1.set("items", "[{\"product_id\": \"prod_003\", \"nama_produk\": \"Sunscreen SPF 50\", \"quantity\": 1, \"harga\": 250000}]");
    record1.set("total_harga", 250000);
    record1.set("status_pembayaran", "pending");
    record1.set("status_pesanan", "pending");
    record1.set("alamat_pengiriman", "Jl. Gatot Subroto No. 4, Medan, Sumatera Utara 20123");
    record1.set("kurir_pengiriman", "GCG");
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
    record2.set("nomor_pesanan", "ORD-2026-003");
    const record2_user_idLookup = app.findFirstRecordByFilter("users", "email='user3@beautyshop.com'");
    if (!record2_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user3@beautyshop.com'\""); }
    record2.set("user_id", record2_user_idLookup.id);
    record2.set("items", "[{\"product_id\": \"prod_004\", \"nama_produk\": \"Serum Vitamin C\", \"quantity\": 1, \"harga\": 350000}, {\"product_id\": \"prod_005\", \"nama_produk\": \"Eye Cream\", \"quantity\": 1, \"harga\": 180000}]");
    record2.set("total_harga", 530000);
    record2.set("status_pembayaran", "success");
    record2.set("status_pesanan", "shipped");
    record2.set("alamat_pengiriman", "Jl. Diponegoro No. 5, Yogyakarta, DI Yogyakarta 55123");
    record2.set("kurir_pengiriman", "Pos Indonesia");
    record2.set("nomor_tracking", "POS987654321");
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
    record3.set("nomor_pesanan", "ORD-2026-004");
    const record3_user_idLookup = app.findFirstRecordByFilter("users", "email='user4@beautyshop.com'");
    if (!record3_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user4@beautyshop.com'\""); }
    record3.set("user_id", record3_user_idLookup.id);
    record3.set("items", "[{\"product_id\": \"prod_006\", \"nama_produk\": \"Lip Balm\", \"quantity\": 3, \"harga\": 75000}]");
    record3.set("total_harga", 225000);
    record3.set("status_pembayaran", "failed");
    record3.set("status_pesanan", "cancelled");
    record3.set("alamat_pengiriman", "Jl. Imam Bonjol No. 6, Semarang, Jawa Tengah 50123");
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
    record4.set("nomor_pesanan", "ORD-2026-005");
    const record4_user_idLookup = app.findFirstRecordByFilter("users", "email='user5@beautyshop.com'");
    if (!record4_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user5@beautyshop.com'\""); }
    record4.set("user_id", record4_user_idLookup.id);
    record4.set("items", "[{\"product_id\": \"prod_007\", \"nama_produk\": \"Hair Mask\", \"quantity\": 2, \"harga\": 120000}, {\"product_id\": \"prod_008\", \"nama_produk\": \"Shampoo\", \"quantity\": 1, \"harga\": 95000}]");
    record4.set("total_harga", 335000);
    record4.set("status_pembayaran", "processing");
    record4.set("status_pesanan", "processing");
    record4.set("alamat_pengiriman", "Jl. Hayam Wuruk No. 7, Makassar, Sulawesi Selatan 90123");
    record4.set("kurir_pengiriman", "Tiki");
    record4.set("nomor_tracking", "TIKI456789012");
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
    record5.set("nomor_pesanan", "ORD-2026-006");
    const record5_user_idLookup = app.findFirstRecordByFilter("users", "email='user6@beautyshop.com'");
    if (!record5_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user6@beautyshop.com'\""); }
    record5.set("user_id", record5_user_idLookup.id);
    record5.set("items", "[{\"product_id\": \"prod_009\", \"nama_produk\": \"Body Lotion\", \"quantity\": 1, \"harga\": 180000}, {\"product_id\": \"prod_010\", \"nama_produk\": \"Body Scrub\", \"quantity\": 1, \"harga\": 140000}]");
    record5.set("total_harga", 320000);
    record5.set("status_pembayaran", "success");
    record5.set("status_pesanan", "delivered");
    record5.set("alamat_pengiriman", "Jl. Pemuda No. 8, Palembang, Sumatera Selatan 30123");
    record5.set("kurir_pengiriman", "JNE");
    record5.set("nomor_tracking", "JNE111222333");
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
    record6.set("nomor_pesanan", "ORD-2026-007");
    const record6_user_idLookup = app.findFirstRecordByFilter("users", "email='user1@beautyshop.com'");
    if (!record6_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user1@beautyshop.com'\""); }
    record6.set("user_id", record6_user_idLookup.id);
    record6.set("items", "[{\"product_id\": \"prod_011\", \"nama_produk\": \"Face Mask Sheet\", \"quantity\": 5, \"harga\": 50000}]");
    record6.set("total_harga", 250000);
    record6.set("status_pembayaran", "success");
    record6.set("status_pesanan", "shipped");
    record6.set("alamat_pengiriman", "Jl. Ahmad Yani No. 3, Surabaya, Jawa Timur 60123");
    record6.set("kurir_pengiriman", "GCG");
    record6.set("nomor_tracking", "GCG333444555");
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
    record7.set("nomor_pesanan", "ORD-2026-008");
    const record7_user_idLookup = app.findFirstRecordByFilter("users", "email='user2@beautyshop.com'");
    if (!record7_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user2@beautyshop.com'\""); }
    record7.set("user_id", record7_user_idLookup.id);
    record7.set("items", "[{\"product_id\": \"prod_012\", \"nama_produk\": \"Makeup Remover\", \"quantity\": 1, \"harga\": 165000}, {\"product_id\": \"prod_013\", \"nama_produk\": \"Toner\", \"quantity\": 1, \"harga\": 135000}]");
    record7.set("total_harga", 300000);
    record7.set("status_pembayaran", "pending");
    record7.set("status_pesanan", "processing");
    record7.set("alamat_pengiriman", "Jl. Gatot Subroto No. 4, Medan, Sumatera Utara 20123");
    record7.set("kurir_pengiriman", "Pos Indonesia");
  try {
    app.save(record7);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record8 = new Record(collection);
    record8.set("nomor_pesanan", "ORD-2026-009");
    const record8_user_idLookup = app.findFirstRecordByFilter("users", "email='user3@beautyshop.com'");
    if (!record8_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user3@beautyshop.com'\""); }
    record8.set("user_id", record8_user_idLookup.id);
    record8.set("items", "[{\"product_id\": \"prod_014\", \"nama_produk\": \"Essence\", \"quantity\": 1, \"harga\": 220000}, {\"product_id\": \"prod_015\", \"nama_produk\": \"Sleeping Mask\", \"quantity\": 1, \"harga\": 190000}]");
    record8.set("total_harga", 410000);
    record8.set("status_pembayaran", "success");
    record8.set("status_pesanan", "delivered");
    record8.set("alamat_pengiriman", "Jl. Diponegoro No. 5, Yogyakarta, DI Yogyakarta 55123");
    record8.set("kurir_pengiriman", "JNE");
    record8.set("nomor_tracking", "JNE555666777");
  try {
    app.save(record8);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
    } else {
      throw e;
    }
  }

  const record9 = new Record(collection);
    record9.set("nomor_pesanan", "ORD-2026-010");
    const record9_user_idLookup = app.findFirstRecordByFilter("users", "email='user4@beautyshop.com'");
    if (!record9_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user4@beautyshop.com'\""); }
    record9.set("user_id", record9_user_idLookup.id);
    record9.set("items", "[{\"product_id\": \"prod_016\", \"nama_produk\": \"Primer\", \"quantity\": 1, \"harga\": 175000}, {\"product_id\": \"prod_017\", \"nama_produk\": \"Foundation\", \"quantity\": 1, \"harga\": 280000}, {\"product_id\": \"prod_018\", \"nama_produk\": \"Concealer\", \"quantity\": 1, \"harga\": 160000}]");
    record9.set("total_harga", 615000);
    record9.set("status_pembayaran", "cancelled");
    record9.set("status_pesanan", "cancelled");
    record9.set("alamat_pengiriman", "Jl. Imam Bonjol No. 6, Semarang, Jawa Tengah 50123");
  try {
    app.save(record9);
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
