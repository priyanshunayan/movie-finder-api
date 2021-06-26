const express = require("express");
const db = require("../database");
const router = express.Router();
const request = require("request");

router.get("/", (req, res, next) => {
  // get session id only
  const { session_id } = req.query;

  // read from query table on corresponding session id and return union of two queries

  // Language selected -> English, Hindi, French, Japenese, Dutch, Russian, Portuguese, indonesian,

  const retrieveQuery = `SELECT start_year, end_year, rating_start, rating_end, genre, language FROM query WHERE session_id="${session_id}"`;

  db.then(async (db) => {
    const results = await db.all(retrieveQuery);
    return { results, db };
  })
    .then(({ results, db }) => {
      let query = [];
      const querySet = new Set();
      results.forEach(
        ({
          start_year,
          end_year,
          rating_start,
          rating_end,
          genre,
          language,
        }) => {
          const genreArray = genre.split(",");
          const languageArray = language?.split(",") || [];
          genreArray.forEach((genreEle) => {
            let sql;
            if (languageArray.length > 0) {
              languageArray.forEach((lang) => {
                if (genreEle !== "All genres") {
                  sql = `SELECT * FROM movie WHERE original_language LIKE "%${lang}%" AND Genre LIKE '%${genreEle}%' AND Released_Year BETWEEN ${start_year} AND ${end_year} AND IMDB_Rating BETWEEN ${rating_start} AND ${rating_end}`;
                } else {
                  sql = `SELECT * FROM movie WHERE original_language LIKE "%${lang}%" AND Released_Year BETWEEN ${start_year} AND ${end_year} AND IMDB_Rating BETWEEN ${rating_start} AND ${rating_end}`;
                }
                querySet.add(sql);
              });
            } else {
              if (genreEle !== "All genres") {
                sql = `SELECT * FROM movie WHERE Genre LIKE '%${genreEle}%' AND Released_Year BETWEEN ${start_year} AND ${end_year} AND IMDB_Rating BETWEEN ${rating_start} AND ${rating_end}`;
              } else {
                sql = `SELECT * FROM movie WHERE Released_Year BETWEEN ${start_year} AND ${end_year} AND IMDB_Rating BETWEEN ${rating_start} AND ${rating_end}`;
              }
              querySet.add(sql);
            }
          });
        }
      );
      query = [...querySet];
      return { query, db };
    })
    .then(async ({ query, db }) => {
      console.log("query", query);
      const bothResults = [];
      for (let index = 0; index < query.length; index++) {
        const tempResult = await db.all(query[index]);
        bothResults.push(...tempResult);
      }
      return bothResults;
    })
    .then((results) => {
      const uniqueArray = results.filter((thing, index) => {
        const _thing = JSON.stringify(thing);
        return (
          index ===
          results.findIndex((obj) => {
            return JSON.stringify(obj) === _thing;
          })
        );
      });
      return uniqueArray;
    })
    .then((response) => {
      res.status(200).json({
        totalItems: response.length,
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
