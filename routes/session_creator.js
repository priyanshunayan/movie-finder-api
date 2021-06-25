const express = require("express");
const router = express.Router();
const shortId = require("shortid");
const db = require("../database");

router.get("/:session_id", (req, res) => {
  const session_id = req.params.session_id;

  /* Select created at date of the provided session and check if can join or not */
  const sqlQuery = `SELECT session_creator FROM sessions WHERE id="${session_id}"`;

  db.then(async (db) => {
    const result = await db.all(sqlQuery);
    res.status(200).json({
      session_id: session_id,
      session_creator: result[0].session_creator,
    });
  }).catch((err) => {
    res.status(500).json({
      error: err.message,
    });
  });
});

module.exports = router;
