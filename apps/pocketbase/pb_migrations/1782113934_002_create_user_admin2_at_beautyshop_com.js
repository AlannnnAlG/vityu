/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");
  const record = new Record(collection);
  record.set("email", "admin2@beautyshop.com");
  record.setPassword("AdminPass456!");
  record.set("nama_lengkap", "Budi Santoso");
  record.set("nomor_telepon", "081234567891");
  record.set("alamat", "Jl. Sudirman No. 2");
  record.set("kota", "Bandung");
  record.set("provinsi", "Jawa Barat");
  record.set("kode_pos", "40123");
  record.set("role", "admin");
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
    const record = app.findFirstRecordByData("users", "email", "admin2@beautyshop.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})
