const express = require("express");
const router = express.Router();
const shortId = require("shortid");
const db = require("../database");

router.get("/", (req, res) => {
  const { session_id } = req.query;

  const query = `SELECT movie_title FROM liked WHERE session_id="${session_id}" GROUP BY movie_title HAVING COUNT(movie_title) >= 2`;

  db.then(async (db) => {
    console.log(query);
    const result = await db.all(query);
    console.log(result);
    res.status(200).json({
      totalItems: result.length,
      data: result,
    });
  }).catch((err) => {
    res.status(500).json({
      error: err.message,
    });
  });
});

module.exports = router;
