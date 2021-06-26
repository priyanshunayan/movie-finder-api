"use strict";

let WSServer = require("ws").Server;
let server = require("http").createServer();
let app = require("./index.js");
const db = require("./database");
const url = require("url");

// Create web socket server on top of a regular http server
let wss = new WSServer({
  server: server,
});

// Also mount the app here
server.on("request", app);

wss.on("connection", function connection(ws, req) {
  const pathname = url.parse(req.url).pathname;
  const path_name_split = pathname.split("/");
  const session_id = path_name_split[path_name_split.length - 1];

  /* Can join the session */
  if (session_id && pathname.includes("can_join")) {
    const canJoinQuery = `SELECT * FROM query WHERE session_id="${session_id}"`;
    db.then(async (db) => {
      const numberInQuery = await db.all(canJoinQuery);
      wss.clients.forEach(function each(client) {
        if (client.readyState === 1) {
          console.log("message sent", session_id);
          client.send(
            JSON.stringify({
              session_id: session_id,
              refresh: numberInQuery.length > 1 ? 1 : 0,
            })
          );
        }
      });
    });
  }

  /* Matched movies Realtime */
  if (session_id && pathname.includes("matched_movie")) {
    ws.on("message", (data) => {
      if (data === "liked_movie") {
        const matchedMovieQuery = `SELECT * FROM movie WHERE Series_Title IN (SELECT movie_title FROM liked WHERE session_id="${session_id}" GROUP BY movie_title HAVING COUNT(movie_title) >= 2)`;
        db.then(async (db) => {
          const result = await db.all(matchedMovieQuery);
          wss.clients.forEach(function each(client) {
            if (client.readyState === 1) {
              client.send(
                JSON.stringify({
                  session_id: session_id,
                  totalItems: result.length,
                  data: result,
                  matched_movie_res: 1,
                })
              );
            }
          });
        });
      }
    });
  }
});

server.listen(process.env.PORT || 8080, function () {
  console.log(`http/ws server listening on ${process.env.PORT || 8080}`);
});
