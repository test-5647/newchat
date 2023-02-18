const express = require("express");

const path = require("path");
const app = express();
app.use(express.static("./client/build"));

const http = require("http").createServer(app);

const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

let users = {};

io.on("connection", (socket) => {
  users[socket.handshake.auth.myId] = socket.id;
  console.log("connected => ", socket.id);
  socket.on("disconnect", () => {
    console.log("disconnected => ", socket.id);
  });

  socket.on("send-message", (msg) => {
    console.log("called........");
    socket.to(users[msg.receiverId]).emit("receive", msg);
  });
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => {
  console.log("listening on ==> ", PORT);
});
