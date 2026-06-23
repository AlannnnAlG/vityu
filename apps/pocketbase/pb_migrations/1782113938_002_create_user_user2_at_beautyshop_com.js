/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");
  const record = new Record(collection);
  record.set("email", "user2@beautyshop.com");
  record.setPassword("UserPass456!");
  record.set("nama_lengkap", "Dewi Lestari");
  record.set("nomor_telepon", "081234567893");
  record.set("alamat", "Jl. Gatot Subroto No. 4");
  record.set("kota", "Medan");
  record.set("provinsi", "Sumatera Utara");
  record.set("kode_pos", "20123");
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
    const record = app.findFirstRecordByData("users", "email", "user2@beautyshop.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})
