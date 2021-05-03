const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

const db = sqlite
  .open({
    filename: "./movie_finder.db",
    driver: sqlite3.Database,
  })
  .then(async (db) => {
    // const result = await db.all("SELECT Genre FROM movies");
    // console.log(result);
    console.log("DB open");
    return db;
  });

module.exports = db;
