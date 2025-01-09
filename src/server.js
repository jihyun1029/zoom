import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anon";
    console.log("Connected to Browser ✅");
    socket.on("close", () => console.log("Disconnected from the Browser ❌"));
    // socket.on("message", (message) => {
    socket.on("message", (msg) => {
        // console.log(message.toString());
        // const parsed = JSON.parse(message.toString());
        const message = JSON.parse(msg.toString());
        // console.log(parsed, message.toString());
        /*if(parsed.type === "new_message") {
            sockets.forEach((aSocket) => aSocket.send(parsed.payload));
        } else if(parsed.type === "nickname") {
            console.log(parsed.payload)
        }*/
        switch (message.type) {
            case "new_message":
                sockets.forEach((aSocket) =>
                    aSocket.send(`${socket.nickname} : ${message.payload}`)
                );
            case "nickname":
                 // console.log(parsed.payload)
                socket["nickname"] = message.payload;
        }
    });
});

server.listen(3000, handleListen);