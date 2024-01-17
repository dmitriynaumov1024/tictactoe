import { createServer } from "./server/createServer.js"
import express from "express"
import GameServer from "./game/GameServer.js"

// easy!
// create server aggregate object
let server = createServer({
    https: true,
    key: "../openssl/key/localhost.key",
    cert: "../openssl/cert/localhost.crt"
})

// configure http handlers
server.http.use(express.static("./dist"))

let gameserver = GameServer.create()
gameserver.setCleanupInterval()

// configure socket handler
server.socket.on("connection", (connection)=> {
    console.log("Connected")
    let player = gameserver.handle("join", connection)
    connection.on("message", (message)=> {
        player.handle(message)
    })
    connection.on("close", ()=> {
        console.log("Disconnected")
        gameserver.getGame(player)?.removePlayer(player)
    })
})

server.listen(8000)

console.log("Server is listening to port 8000...")
