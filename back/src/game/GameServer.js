import Player from "./Player.js"
import TicTacToe from "./TicTacToe.js"
import { eventHandler } from "./utils.js"

export default {
    create () {
        return eventHandler({
            games: [ ],
            players: [ ],
            handlers: { 
                join (connection) {
                    let player = Player.create(connection, this)
                    this.players.push(player)
                    return player
                },
                joinGame ({ player, id }) {
                    // detach from previous game
                    this.getGame(player)?.removePlayer(player)
                    // find game
                    let game = this.games.find(game => game.id == id)
                    if (!game) {
                        player.emit("notification", { text: `Game ${id} does not exist.` })
                        return
                    }
                    // attach to game
                    let success = game.addPlayer(player) 
                    if (success) {
                        player.gameId = id
                        player.emit("notification", { text: `You joined game ${id}.` })
                        player.emit("update", { player: player, game: game })
                    }
                    else {
                        player.emit("notification", { text: `Can not join ${id}: there already are 2 of 2 players.` })
                    }
                },
                createGame ({ player, size, standalone }) {
                    let game = TicTacToe.create({ size, standalone })
                    let id = game.id
                    this.games.push(game)
                    let success = game.addPlayer(player) 
                    if (success) {
                        player.gameId = id
                        player.emit("notification", { text: `You created game ${id}.` })
                    }
                    else {
                        player.emit("notification", { text: `Can not create game. Something went wrong.` })
                    }
                }
            },
            getGame (player) {
                return this.games.find(game => game.id == player.gameId)
            },
            getLobby () {
                return this.games.filter(game => (game.standalone == false) && (game.players[0] == null || game.players[1] == null))
                                 .slice(0, 30).map(game => ({ id: game.id, size: game.size, players: game.players }))
            },
            cleanup () {
                let counter = 0
                let healthyGames = [ ]
                let gameTTL = 600 * 1000 // 10 mins
                for (let game of this.games) {
                    let timeMargin = (game.players[0] || game.players[1])? (Date.now() - gameTTL*2) : (Date.now() - gameTTL)
                    if (game.createdAt > timeMargin || game.pingAt[0]>timeMargin || game.pingAt[1]>timeMargin) {
                        healthyGames.push(game)
                    }
                    else {
                        game.players[0]?.handle("joinLobby", null)
                        game.players[1]?.handle("joinLobby", null)
                        counter++
                    }
                }
                if (counter > 0) console.log("Cleaned up " + counter + " expired games")
                this.games = healthyGames
            },
            setCleanupInterval() {
                setInterval(()=> this.cleanup(), 10000)
            }
        })
    }
}
