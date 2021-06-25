const express = require("express");
const router = express.Router();
const shortId = require("shortid");
const db = require("../database");

router.post("/", (req, res) => {
  const { session_id, start_year, end_year, rating_start, rating_end, genre } =
    req.body;

  const id = shortId();
  const sqlQuery = `INSERT INTO query (id, session_id, start_year, end_year, rating_start, rating_end, genre) VALUES ("${id}", "${session_id}", ${start_year}, ${end_year}, ${rating_start}, ${rating_end}, "${genre}");`;

  db.then(async (db) => {
    const result1 = await db.exec(sqlQuery);
    res.status(200).json({
      session_id: session_id,
      message: "Query registered successfully!",
    });
  }).catch((err) => {
    res.status(500).json({
      error: err.message,
    });
  });
});

module.exports = router;
