/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("orders");

  const record0 = new Record(collection);
    record0.set("nomor_pesanan", "ORD-2024-001");
    const record0_user_idLookup = app.findFirstRecordByFilter("users", "email='user@vityuu.com'");
    if (!record0_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user@vityuu.com'\""); }
    record0.set("user_id", record0_user_idLookup.id);
    record0.set("items", "[{\"product_id\": \"prod_001\", \"nama_produk\": \"Facial Cleanser Gentle\", \"quantity\": 2, \"harga\": 69000}]");
    record0.set("total_harga", 138000);
    record0.set("status_pesanan", "delivered");
    record0.set("status_pembayaran", "success");
    record0.set("alamat_pengiriman", "Jl. Merdeka No. 123, Jakarta Pusat");
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
    record1.set("items", "[{\"product_id\": \"prod_002\", \"nama_produk\": \"Liquid Foundation Pro\", \"quantity\": 1, \"harga\": 99000}]");
    record1.set("total_harga", 99000);
    record1.set("status_pesanan", "shipped");
    record1.set("status_pembayaran", "success");
    record1.set("alamat_pengiriman", "Jl. Sudirman No. 456, Jakarta Selatan");
    record1.set("kurir_pengiriman", "JNE");
    record1.set("nomor_tracking", "JNE123456789");
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
    record2.set("items", "[{\"product_id\": \"prod_003\", \"nama_produk\": \"Hair Mask Nourishing\", \"quantity\": 1, \"harga\": 75000}]");
    record2.set("total_harga", 75000);
    record2.set("status_pesanan", "processing");
    record2.set("status_pembayaran", "processing");
    record2.set("alamat_pengiriman", "Jl. Ahmad Yani No. 789, Bandung");
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
    record3.set("items", "[{\"product_id\": \"prod_004\", \"nama_produk\": \"Body Lotion Moisturizing\", \"quantity\": 3, \"harga\": 49000}]");
    record3.set("total_harga", 147000);
    record3.set("status_pesanan", "pending");
    record3.set("status_pembayaran", "pending");
    record3.set("alamat_pengiriman", "Jl. Gatot Subroto No. 321, Surabaya");
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
    record4.set("items", "[{\"product_id\": \"prod_001\", \"nama_produk\": \"Facial Cleanser Gentle\", \"quantity\": 1, \"harga\": 69000}, {\"product_id\": \"prod_002\", \"nama_produk\": \"Liquid Foundation Pro\", \"quantity\": 1, \"harga\": 99000}]");
    record4.set("total_harga", 168000);
    record4.set("status_pesanan", "cancelled");
    record4.set("status_pembayaran", "failed");
    record4.set("alamat_pengiriman", "Jl. Diponegoro No. 654, Medan");
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
