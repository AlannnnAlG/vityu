/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("users");
  const record = new Record(collection);
  record.set("email", "admin1@beautyshop.com");
  record.setPassword("AdminPass123!");
  record.set("nama_lengkap", "Siti Nurhaliza");
  record.set("nomor_telepon", "081234567890");
  record.set("alamat", "Jl. Merdeka No. 1");
  record.set("kota", "Jakarta");
  record.set("provinsi", "DKI Jakarta");
  record.set("kode_pos", "12345");
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
    const record = app.findFirstRecordByData("users", "email", "admin1@beautyshop.com");
    app.delete(record);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Auth record not found, skipping rollback");
      return;
    }
    throw e;
  }
})
