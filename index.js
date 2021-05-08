const express = require("express");
const app = express();

const movieRoute = require("./routes/movie");
const sessionRote = require("./routes/create_session");
const registerQueryRoute = require("./routes/register_query");
const joinSession = require("./routes/join_session");
const likeMovieRoute = require("./routes/like_movie");
const matchedMovieRoute = require("./routes/matched_movie");
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use("/fetch-movies", movieRoute);
app.use("/create-session", sessionRote);
app.use("/register-query", registerQueryRoute);
app.use("/join-session", joinSession);
app.use("/like-movie", likeMovieRoute);
app.use("/matched-movies", matchedMovieRoute);

app.listen("3000", (err) => {
  if (err) throw err;
  console.log("Server running at port 3000");
});
