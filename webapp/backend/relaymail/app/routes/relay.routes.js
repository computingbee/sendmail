module.exports = app => {
  const relays = require("../controllers/relay.controller.js");

  var router = require("express").Router();

  router.get("/", (req, res) => {
    res.json({ message: "RelayMail REST API" })
  });

  router.post("/relay", relays.relay);

  router.get("/history", relays.history);

  app.use("/api/relaymail", router);
};