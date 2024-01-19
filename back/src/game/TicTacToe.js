import { randomId, probability, clamp } from "./utils.js"
import sign from "./TicTacToeSign.js"

const boardSize = {
    min: 2,
    default: 3,
    max: 5
}

export default {
    create ({ size, standalone = false }) {
        let result = {
            id: randomId(),
            size: clamp(size ?? boardSize.default, boardSize.min, boardSize.max),
            standalone: standalone,
            grid: [],
            players: [ null, null ],
            pingAt: [ 0, 0 ],
            playerSigns: [ null, null ],
            createdAt: Date.now(),
            startAt: null,
            elapsedTime: null,
            endAt: null,
            currentPlayer: null,
            winnerPlayer: null,
            winnerSign: null,
            addPlayer (player) {
                if (this.standalone && this.players[0] == null) {
                    this.players[0] = player
                    this.players[1] = player
                    this.pingAt[0] = Date.now()
                    this.emitUpdate()
                    return true
                }
                for (let i of [0, 1]) {
                    if (this.players[i] == null) {
                        this.players[i] = player
                        this.pingAt[i] = Date.now()
                        this.emitUpdate()
                        return true
                    }
                }
                return false
            },
            removePlayer (player) {
                let removed = false
                for (let i of [0, 1]) {
                    if (this.players[i]?.id == player?.id) {
                        this.players[i] = null
                        removed = true
                        if (this.winnerPlayer == i) this.winnerPlayer = -1
                    }
                }
                if (removed) this.emitUpdate()
                return removed
            },
            reset (player) {
                if (!this.players.find(p => p.id == player.id)) {
                    return false
                }
                this.resetGrid()
                this.playerSigns = probability(0.5) ?
                    [ sign.cross, sign.zero ] :
                    [ sign.zero, sign.cross ]
                this.draw = false
                this.startAt = Date.now()
                this.endAt = null
                this.winnerPlayer = null
                this.currentPlayer = probability(0.5) ? 0 : 1
                this.emitUpdate()
            },
            resetGrid () {
                this.grid = []
                for (let i=0; i<this.size; i+=1) {
                    let row = []
                    this.grid.push(row)
                    for (let j=0; j<this.size; j+=1) {
                        row.push(null)
                    }
                }
            },
            putSign (player, row, col) {
                let canPutSign = 
                    (this.endAt == null) &&
                    (this.grid[row][col] == null) &&
                    (this.currentPlayer != null) &&
                    (this.standalone || (this.players.findIndex(p => p.id == player.id) == this.currentPlayer))

                if (canPutSign) {
                    this.grid[row][col] = this.playerSigns[this.currentPlayer]
                    this.currentPlayer = (this.currentPlayer == 1)? 0 : 1
                    this.pingAt[this.currentPlayer] = Date.now()
                    this.checkWin()
                    this.emitUpdate()
                }
            },
            checkWin () {
                let emptyCells = 0
                for (let i=0; i<this.size; i++) {
                    for (let j=0; j<this.size; j++) {
                        if (this.grid[i][j] == sign.null) emptyCells++
                    }
                }

                // console.log(this.grid)
                for (let i=0; i<this.size; i++) {
                    let rowCount = { [sign.zero]: 0, [sign.cross]: 0, [sign.null]: 0 }
                    let colCount = { [sign.zero]: 0, [sign.cross]: 0, [sign.null]: 0 }
                    let diag1Count = { [sign.zero]: 0, [sign.cross]: 0, [sign.null]: 0 }
                    let diag2Count = { [sign.zero]: 0, [sign.cross]: 0, [sign.null]: 0 }
                    for (let j=0; j<this.size; j++) {
                        rowCount[this.grid[i][j]] += 1
                        colCount[this.grid[j][i]] += 1
                        diag1Count[this.grid[j][j]] += 1
                        diag2Count[this.grid[this.size-j-1][j]] += 1
                    }
                    // console.log([rowCount, colCount, diag1Count, diag2Count])
                    for (let k of [0, 1]) {
                        let currentsign = this.playerSigns[k]
                        for (let counter of [rowCount, colCount, diag1Count, diag2Count]) {
                            if (counter[currentsign] == this.size) {
                                // console.log({ counter, i })
                                this.winnerPlayer = k
                                this.currentPlayer = null
                                this.winnerSign = currentsign
                                this.endAt = Date.now()
                                return
                            }
                        }
                    }
                }

                if (emptyCells == 0) {
                    this.draw = true
                    this.currentPlayer = null
                    this.endAt = Date.now()
                }
            },
            emitUpdate() {
                for (let player of this.players) {
                    if (player != null) {
                        player.emit("update", { game: this })
                    }
                }
            }
        }
        result.resetGrid()
        return result
    }
}
