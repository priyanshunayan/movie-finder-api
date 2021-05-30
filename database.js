const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

const db = sqlite
  .open({
    filename: "./movie_finder.db",
    driver: sqlite3.Database,
  })
  .then(async (db) => {
    console.log("DB open");
    return db;
  });

module.exports = db;
