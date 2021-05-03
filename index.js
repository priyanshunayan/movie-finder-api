const express = require("express");
const app = express();


const movieRoute = require("./routes/movie");



app.use("/fetch-movies", movieRoute);

app.listen("3000", (err) => {
  if (err) throw err;
  console.log("Server running at port 3000");
});
