import GameServer from "./game/GameServer.js"

let server = GameServer.create()
server.on("join", ({ name })=> {
    console.log(name)
})
server.handle("join", { name: "Dmitriy" })
server.handle(JSON.stringify({ topic: "join", data: { name: "Dmitriy" } }))

