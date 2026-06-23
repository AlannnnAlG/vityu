/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("payment_transactions");

  const record0 = new Record(collection);
    record0.set("order_id", "ORD-2024-001");
    const record0_user_idLookup = app.findFirstRecordByFilter("users", "email='user@vityuu.com'");
    if (!record0_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user@vityuu.com'\""); }
    record0.set("user_id", record0_user_idLookup.id);
    record0.set("transaction_id", "TXN-2024-001");
    record0.set("amount", 138000);
    record0.set("payment_method", "credit_card");
    record0.set("status", "success");
    record0.set("gateway_response", "{\"status\": \"approved\", \"code\": \"00\", \"message\": \"Transaction successful\"}");
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
    record1.set("order_id", "ORD-2024-002");
    const record1_user_idLookup = app.findFirstRecordByFilter("users", "email='user@vityuu.com'");
    if (!record1_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user@vityuu.com'\""); }
    record1.set("user_id", record1_user_idLookup.id);
    record1.set("transaction_id", "TXN-2024-002");
    record1.set("amount", 99000);
    record1.set("payment_method", "bank_transfer");
    record1.set("status", "success");
    record1.set("gateway_response", "{\"status\": \"approved\", \"code\": \"00\", \"message\": \"Transaction successful\"}");
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
    record2.set("order_id", "ORD-2024-003");
    const record2_user_idLookup = app.findFirstRecordByFilter("users", "email='user@vityuu.com'");
    if (!record2_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user@vityuu.com'\""); }
    record2.set("user_id", record2_user_idLookup.id);
    record2.set("transaction_id", "TXN-2024-003");
    record2.set("amount", 75000);
    record2.set("payment_method", "e_wallet");
    record2.set("status", "processing");
    record2.set("gateway_response", "{\"status\": \"pending\", \"code\": \"01\", \"message\": \"Waiting for confirmation\"}");
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
    record3.set("order_id", "ORD-2024-004");
    const record3_user_idLookup = app.findFirstRecordByFilter("users", "email='user@vityuu.com'");
    if (!record3_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user@vityuu.com'\""); }
    record3.set("user_id", record3_user_idLookup.id);
    record3.set("transaction_id", "TXN-2024-004");
    record3.set("amount", 147000);
    record3.set("payment_method", "credit_card");
    record3.set("status", "pending");
    record3.set("gateway_response", "{\"status\": \"pending\", \"code\": \"01\", \"message\": \"Awaiting payment\"}");
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
    record4.set("order_id", "ORD-2024-005");
    const record4_user_idLookup = app.findFirstRecordByFilter("users", "email='user@vityuu.com'");
    if (!record4_user_idLookup) { throw new Error("Lookup failed for user_id: no record in 'users' matching \"email='user@vityuu.com'\""); }
    record4.set("user_id", record4_user_idLookup.id);
    record4.set("transaction_id", "TXN-2024-005");
    record4.set("amount", 168000);
    record4.set("payment_method", "credit_card");
    record4.set("status", "failed");
    record4.set("gateway_response", "{\"status\": \"declined\", \"code\": \"05\", \"message\": \"Card declined\"}");
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
