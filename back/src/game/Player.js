import { eventHandler, randomId } from "./utils.js"

export default {
    create (connection, server) {
        return eventHandler({
            id: randomId(),
            gameId: null,
            name: null,
            pingAt: Date.now(),
            handlers: { 
                setName (name) {
                    if (this.name) return
                    this.name = name
                    this.emit("update", { player: this })
                },
                joinLobby () {
                    if (this.gameId) {
                        server.getGame(this)?.removePlayer(this)
                    }
                    this.emit("update", { player: this, game: null, lobby: server.getLobby() })
                },
                ping () {
                    this.pingAt = Date.now()
                },
                joinGame (id) {
                    server.handle("joinGame", { player: this, id: id })
                },
                createGame ({ size, standalone }) {
                    server.handle("createGame", { player: this, size: size, standalone: standalone })
                },
                pingGame (id) {
                    this.pingAt = Date.now()
                    server.handle("pingGame", { player: this, id: id })
                },
                putSign ({ row, col }) {
                    server.getGame(this)?.putSign(this, row, col)
                },
                resetGame () {
                    server.getGame(this)?.reset(this)
                },
                syncTime () {
                    this.emit("syncTime", Date.now())
                }
            },
            emit (topic, data) {
                connection.send(JSON.stringify({ topic, data }))
            }
        })
    }
}
