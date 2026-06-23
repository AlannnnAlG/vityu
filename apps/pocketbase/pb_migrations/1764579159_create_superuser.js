migrate((app) => {
  const superuser = new Record(app.findCollectionByNameOrId("_superusers"));
  superuser.set("email", "admin@example.com");
  superuser.set("password", "admin123456");
  app.save(superuser);
});