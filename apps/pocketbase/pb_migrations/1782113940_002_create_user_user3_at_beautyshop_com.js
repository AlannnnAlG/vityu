/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");
  const record = new Record(collection);
  record.set("email", "user3@beautyshop.com");
  record.setPassword("UserPass789!");
  record.set("nama_lengkap", "Sinta Kusuma");
  record.set("nomor_telepon", "081234567894");
  record.set("alamat", "Jl. Diponegoro No. 5");
  record.set("kota", "Yogyakarta");
  record.set("provinsi", "DI Yogyakarta");
  record.set("kode_pos", "55123");
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
    const record = app.findFirstRecordByData("users", "email", "user3@beautyshop.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})
