const express = require("express");
const router = express.Router();
const shortId = require("shortid");
const db = require("../database");

router.post("/", (req, res) => {
  const { session_creator } = req.body;
  console.log(session_creator);
  const created_at = new Date().getTime();
  const id = shortId();
  const sqlQuery = `INSERT INTO sessions (id, session_creator, created_at) VALUES ("${id}", "${session_creator}", ${created_at});`;
  db.then(async (db) => {
    await db.exec(sqlQuery);
    res.status(200).json({
      session_id: id,
    });
  }).catch((err) => {
    res.status(500).json({
      error: err.message,
    });
  });
});

module.exports = router;
