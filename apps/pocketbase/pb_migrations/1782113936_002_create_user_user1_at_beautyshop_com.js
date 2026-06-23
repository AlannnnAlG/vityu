/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");
  const record = new Record(collection);
  record.set("email", "user1@beautyshop.com");
  record.setPassword("UserPass123!");
  record.set("nama_lengkap", "Rina Wijaya");
  record.set("nomor_telepon", "081234567892");
  record.set("alamat", "Jl. Ahmad Yani No. 3");
  record.set("kota", "Surabaya");
  record.set("provinsi", "Jawa Timur");
  record.set("kode_pos", "60123");
  record.set("role", "user");
  record.set("verified", true);
  try {
    return app.save(record);
  } catch (e) {
    if (e.message.includes("Value must be unique")) {
      console.log("Record with unique value already exists, skipping");
      return;
    }
    throw e;
  }
}, (app) => {
  try {
    const record = app.findFirstRecordByData("users", "email", "user1@beautyshop.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})
