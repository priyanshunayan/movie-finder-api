const express = require("express");
const router = express.Router();
const shortId = require("shortid");
const db = require("../database");

router.post("/", (req, res) => {
  const { session_id, movie_title } = req.body;
  const id = shortId();
  const sqlQuery = `INSERT INTO liked (id, session_id, movie_title) VALUES ("${id}", "${session_id}", "${movie_title}");`;

  db.then(async (db) => {
    await db.exec(sqlQuery);

    res.status(200).json({
      success: 1,
      session_id: session_id,
    });
  }).catch((err) => {
    res.status(500).json({
      error: err.message,
    });
  });
});

module.exports = router;
