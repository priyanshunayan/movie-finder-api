const express = require("express");
var cors = require("cors");
const app = express();
const morgan = require("morgan");

const movieRoute = require("./routes/movie");
const sessionRote = require("./routes/create_session");
const registerQueryRoute = require("./routes/register_query");
const joinSession = require("./routes/join_session");
const likeMovieRoute = require("./routes/like_movie");
const matchedMovieRoute = require("./routes/matched_movie");
const hasJoinedRoute = require("./routes/has_joined");
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.use(morgan("tiny"));

app.use("/fetch-movies", movieRoute);
app.use("/create-session", sessionRote);
app.use("/register-query", registerQueryRoute);
app.use("/join-session", joinSession);
app.use("/like-movie", likeMovieRoute);
app.use("/matched-movies", matchedMovieRoute);
app.use("/has-joined", hasJoinedRoute);

app.listen("3000", (err) => {
  if (err) throw err;
});
