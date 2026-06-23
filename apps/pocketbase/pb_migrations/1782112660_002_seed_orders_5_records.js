/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("orders");

  const record0 = new Record(collection);
    record0.set("nomor_pesanan", "ORD-2024-001");
    const record0_user_idLookup = app.findFirstRecordByFilter("users", "email='user@vityuu.com'");
    if (!record0_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user@vityuu.com'\""); }
    record0.set("user_id", record0_user_idLookup.id);
    record0.set("items", "[{\"nama_produk\": \"Facial Cleanser\", \"quantity\": 2, \"harga\": 50000}, {\"nama_produk\": \"Moisturizer\", \"quantity\": 1, \"harga\": 75000}]");
    record0.set("total_harga", 175000);
    record0.set("status_pesanan", "pending");
    record0.set("status_pembayaran", "pending");
    record0.set("alamat_pengiriman", "Jl. Merdeka No. 123, Jakarta Pusat, DKI Jakarta 12190");
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
    record1.set("nomor_pesanan", "ORD-2024-002");
    const record1_user_idLookup = app.findFirstRecordByFilter("users", "email='user@vityuu.com'");
    if (!record1_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user@vityuu.com'\""); }
    record1.set("user_id", record1_user_idLookup.id);
    record1.set("items", "[{\"nama_produk\": \"Serum Vitamin C\", \"quantity\": 1, \"harga\": 120000}, {\"nama_produk\": \"Face Mask\", \"quantity\": 3, \"harga\": 30000}]");
    record1.set("total_harga", 210000);
    record1.set("status_pesanan", "pending");
    record1.set("status_pembayaran", "pending");
    record1.set("alamat_pengiriman", "Jl. Sudirman No. 456, Jakarta Selatan, DKI Jakarta 12920");
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
    record2.set("nomor_pesanan", "ORD-2024-003");
    const record2_user_idLookup = app.findFirstRecordByFilter("users", "email='user@vityuu.com'");
    if (!record2_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user@vityuu.com'\""); }
    record2.set("user_id", record2_user_idLookup.id);
    record2.set("items", "[{\"nama_produk\": \"Sunscreen SPF 50\", \"quantity\": 2, \"harga\": 85000}, {\"nama_produk\": \"Lip Balm\", \"quantity\": 2, \"harga\": 25000}]");
    record2.set("total_harga", 220000);
    record2.set("status_pesanan", "pending");
    record2.set("status_pembayaran", "pending");
    record2.set("alamat_pengiriman", "Jl. Gatot Subroto No. 789, Jakarta Barat, DKI Jakarta 11480");
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
    record3.set("nomor_pesanan", "ORD-2024-004");
    const record3_user_idLookup = app.findFirstRecordByFilter("users", "email='user@vityuu.com'");
    if (!record3_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user@vityuu.com'\""); }
    record3.set("user_id", record3_user_idLookup.id);
    record3.set("items", "[{\"nama_produk\": \"Hair Shampoo\", \"quantity\": 1, \"harga\": 65000}, {\"nama_produk\": \"Hair Conditioner\", \"quantity\": 1, \"harga\": 65000}, {\"nama_produk\": \"Hair Mask\", \"quantity\": 1, \"harga\": 80000}]");
    record3.set("total_harga", 210000);
    record3.set("status_pesanan", "pending");
    record3.set("status_pembayaran", "pending");
    record3.set("alamat_pengiriman", "Jl. Ahmad Yani No. 321, Jakarta Timur, DKI Jakarta 13140");
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
    record4.set("nomor_pesanan", "ORD-2024-005");
    const record4_user_idLookup = app.findFirstRecordByFilter("users", "email='user@vityuu.com'");
    if (!record4_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user@vityuu.com'\""); }
    record4.set("user_id", record4_user_idLookup.id);
    record4.set("items", "[{\"nama_produk\": \"Body Lotion\", \"quantity\": 2, \"harga\": 55000}, {\"nama_produk\": \"Body Scrub\", \"quantity\": 1, \"harga\": 45000}]");
    record4.set("total_harga", 155000);
    record4.set("status_pesanan", "pending");
    record4.set("status_pembayaran", "pending");
    record4.set("alamat_pengiriman", "Jl. Diponegoro No. 654, Jakarta Pusat, DKI Jakarta 10430");
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
