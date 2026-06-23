/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("payment_transactions");
  collection.indexes.push("CREATE UNIQUE INDEX idx_payment_transactions_transaction_id ON payment_transactions (transaction_id)");
  return app.save(collection);
}, (app) => {
  try {
  const collection = app.findCollectionByNameOrId("payment_transactions");
  collection.indexes = collection.indexes.filter(idx => !idx.includes("idx_payment_transactions_transaction_id"));
  return app.save(collection);
  } catch (e) {
    if (e.message.includes("no rows in result set")) {
      console.log("Collection not found, skipping revert");
      return;
    }
    throw e;
  }
})
