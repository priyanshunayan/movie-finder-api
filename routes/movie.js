const express = require("express");
const db = require("../database");
const router = express.Router();

router.get("/", (req, res, next) => {
  const {
    genre,
    year_start,
    year_end,
    rating_start,
    rating_end,
    page,
  } = req.query;
  const response = console.log(req.query);

  //Construct Query

  const sql = `SELECT * FROM movies WHERE Genre LIKE '%${genre}%' AND Released_Year BETWEEN ${year_start} AND ${year_end} AND IMDB_Rating BETWEEN ${rating_start} AND ${rating_end} LIMIT 20 OFFSET ${
    20 * (page - 1)
  } `;
  db.then(async (db) => {
    const result = await db.all(sql);
    console.log(result);
    res.status(200).json({
      message: "Fetched Movies",
      result: result,
    });
  }).catch((err) => {
    res.status(500).json({
      message: err.message,
    });
  });
});

module.exports = router;
