/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");
  const record = new Record(collection);
  record.set("email", "user5@beautyshop.com");
  record.setPassword("UserPass202!");
  record.set("nama_lengkap", "Maya Santoso");
  record.set("nomor_telepon", "081234567896");
  record.set("alamat", "Jl. Hayam Wuruk No. 7");
  record.set("kota", "Makassar");
  record.set("provinsi", "Sulawesi Selatan");
  record.set("kode_pos", "90123");
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
    const record = app.findFirstRecordByData("users", "email", "user5@beautyshop.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})
