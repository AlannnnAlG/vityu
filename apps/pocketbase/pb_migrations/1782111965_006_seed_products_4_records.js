/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("products");

  const record0 = new Record(collection);
    record0.set("nama_produk", "Facial Cleanser Gentle");
    record0.set("deskripsi", "Pembersih wajah lembut untuk semua jenis kulit");
    record0.set("harga", 89000);
    record0.set("harga_diskon", 69000);
    record0.set("kategori", "skincare");
    record0.set("stok", 50);
    record0.set("status", "published");
    record0.set("spesifikasi", "200ml, pH balanced");
    record0.set("ingredients", "Water, Glycerin, Aloe Vera Extract");
    record0.set("cara_penggunaan", "Gunakan 2x sehari pagi dan malam");
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
    record1.set("nama_produk", "Liquid Foundation Pro");
    record1.set("deskripsi", "Foundation cair dengan coverage sempurna");
    record1.set("harga", 125000);
    record1.set("harga_diskon", 99000);
    record1.set("kategori", "makeup");
    record1.set("stok", 35);
    record1.set("status", "published");
    record1.set("spesifikasi", "30ml, SPF 15");
    record1.set("ingredients", "Water, Talc, Iron Oxides");
    record1.set("cara_penggunaan", "Aplikasikan dengan sponge atau brush");
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
    record2.set("nama_produk", "Hair Mask Nourishing");
    record2.set("deskripsi", "Masker rambut bergizi untuk rambut kering");
    record2.set("harga", 75000);
    record2.set("kategori", "haircare");
    record2.set("stok", 60);
    record2.set("status", "published");
    record2.set("spesifikasi", "250ml, Deep conditioning");
    record2.set("ingredients", "Argan Oil, Keratin, Coconut Oil");
    record2.set("cara_penggunaan", "Aplikasikan ke rambut, diamkan 15 menit");
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
    record3.set("nama_produk", "Body Lotion Moisturizing");
    record3.set("deskripsi", "Lotion tubuh pelembab dengan aroma segar");
    record3.set("harga", 65000);
    record3.set("harga_diskon", 49000);
    record3.set("kategori", "bodycare");
    record3.set("stok", 80);
    record3.set("status", "published");
    record3.set("spesifikasi", "400ml, Non-greasy formula");
    record3.set("ingredients", "Shea Butter, Vitamin E, Aloe Vera");
    record3.set("cara_penggunaan", "Aplikasikan ke seluruh tubuh setelah mandi");
  try {
    app.save(record3);
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
