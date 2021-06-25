const express = require("express");
const router = express.Router();
const shortId = require("shortid");
const db = require("../database");

router.post("/", (req, res) => {
  const { session_id } = req.body;
  /* Select created at date of the provided session and check if can join or not */
  const sqlQuery = `SELECT created_at FROM sessions WHERE id="${session_id}"`;

  db.then(async (db) => {
    const result = await db.all(sqlQuery);
    res.status(200).json({
      session_id: session_id,
      can_join:
        result.length > 0 &&
        result[0].created_at - new Date().getTime() <= 48 * 60 * 60
          ? 1
          : 0,
    });
  }).catch((err) => {
    res.status(400).json({
      error: err.message,
    });
  });
});

module.exports = router;
