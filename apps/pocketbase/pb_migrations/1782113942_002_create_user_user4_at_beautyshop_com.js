/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");
  const record = new Record(collection);
  record.set("email", "user4@beautyshop.com");
  record.setPassword("UserPass101!");
  record.set("nama_lengkap", "Hana Putri");
  record.set("nomor_telepon", "081234567895");
  record.set("alamat", "Jl. Imam Bonjol No. 6");
  record.set("kota", "Semarang");
  record.set("provinsi", "Jawa Tengah");
  record.set("kode_pos", "50123");
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
    const record = app.findFirstRecordByData("users", "email", "user4@beautyshop.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})
