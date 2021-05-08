const express = require("express");
const db = require("../database");
const router = express.Router();

router.get("/", (req, res, next) => {
  // get session id only
  const { session_id } = req.query;

  // read from query table on corresponding session id and return union of two queries

  const retrieveQuery = `SELECT start_year, end_year, rating_start, rating_end, genre FROM query WHERE session_id="${session_id}"`;

  db.then(async (db) => {
    const results = await db.all(retrieveQuery);
    return { results, db };
  })
    .then(({ results, db }) => {
      const response = new Set();
      const query = [];
      results.forEach(
        ({ start_year, end_year, rating_start, rating_end, genre }) => {
          const genreArray = genre.split(",");
          genreArray.forEach((genreEle) => {
            const sql = `SELECT * FROM movies WHERE Genre LIKE '%${genreEle}%' AND Released_Year BETWEEN ${start_year} AND ${end_year} AND IMDB_Rating BETWEEN ${rating_start} AND ${rating_end}`;
            query.push(sql);
          });
        }
      );
      return { query, db };
    })
    .then(async ({ query, db }) => {
      const bothResults = [];
      for (let index = 0; index < query.length; index++) {
        const tempResult = await db.all(query[index]);
        bothResults.push(...tempResult);
      }
      return bothResults;
    })
    .then((results) => {
      const response = new Set();
      for (let i = 0; i < results.length; i++) {
        response.add(results[i]);
      }
      return response;
    })
    .then((response) => {
      res.status(200).json({
        totalItems: response.size,
        data: Array.from(response),
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

module.exports = router;
