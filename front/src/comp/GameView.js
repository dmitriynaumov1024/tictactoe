import { h } from "vue"

const sign = {
    null: null,
    zero: "o",
    cross: "x"
}

const icons = {
    [sign.null](props) {
        return h("rect", { width: 10, height: 10, fill: "#fefefe", opacity: "0.03", transform: `translate(${props.col*10}, ${props.row*10})`, onClick: props.onClick })
    },
    [sign.zero](props) {
        return h("circle", { cx: 5, cy: 5, r: 2.7, fill: "none", stroke: "#553780", "stroke-width": 1, transform: `translate(${props.col*10}, ${props.row*10})` } )   
    },
    [sign.cross](props) {
        return h("path", { d: "M 2.5 2.5 L 7.5 7.5 M 2.5 7.5 L 7.5 2.5", stroke: "#f05454", "stroke-width": 1, transform: `translate(${props.col*10}, ${props.row*10})` })
    }
}

const GameGrid = {
    props: {
        size: Number,
        grid: Array
    },
    emits: [
        "putSign"
    ],
    render() {
        let { size, grid } = this
        return h("div", { class: ["pad-1"] }, [
            h("svg", { style: { display: "block", maxWidth: "100%", width: Math.min(size*75, 360)+"px", margin: "0 auto" }, viewBox: [0, 0, size * 10, size * 10].join(" ") }, [
                grid.map((row, i) => row.map((cell, j) => {
                    return icons[cell]({ row: i, col: j, onClick: ()=> this.$emit("putSign", i, j) })
                })),
                grid.slice(1).map((_, i)=> [
                    h("line", { x1: 10*(i+1), x2: 10*(i+1), y1: 0, y2: size*10, "stroke-width": 0.5, stroke: "#dedede" }),
                    h("line", { y1: 10*(i+1), y2: 10*(i+1), x1: 0, x2: size*10, "stroke-width": 0.5, stroke: "#dedede" })
                ]),
            ])
        ])
    }
}

export default {
    props: {
        client: Object,
        clientData: Object
    },
    methods: {
        resetGame() {
            this.client.emit("resetGame", null)
        },
        putSign(row, col) {
            let game = this.clientData.game
            if (game.grid && (game.grid[row][col] == sign.null)) {
                this.client.emit("putSign", { row, col })
            }
        }
    },
    render() {
        let player = this.clientData.player
        let opponent = this.clientData.game.players.find(p => p?.id != player.id)
        let game = this.clientData.game
        let isMyTurn = game.players[game.currentPlayer]?.id == player.id
        let currentSign = game.playerSigns[game.currentPlayer]
        let elapsedTime = this.clientData.time - (game.startAt ?? this.clientData.time) 
        return [
            h("div", { class: ["card-card", "pad-05", "mar-b-05"] }, [
                h("p", { class: ["mar-b-05"] }, `Playing as: ${player.name} with id ${player.id}`),
                h("p", { class: ["mar-b-05"] }, opponent? `Opponent: ${opponent.name} with id ${opponent.id}` : "All by yourself"),
                (game.currentPlayer!=null)? h("p", { class: ["mar-b-05"] }, `${isMyTurn? "This is your turn " : "This is your opponent's turn "} (${currentSign})`) : null,
                game.draw? h("p", { class: ["mar-b-05", "text-bold"] }, "That is a draw!") :
                (game.winnerPlayer!=null)? h("p", { class: ["mar-b-05", "text-bold"] }, `Winner: ${game.players[game.winnerPlayer]?.name ?? "Someone who disconnected really quick"} with id ${game.players[game.winnerPlayer]?.id ?? "that is a secret"}`) : null,
                (game.grid?.length > 0)? h(GameGrid, { size: game.size, grid: game.grid, onPutSign: (row, col)=> this.putSign(row, col) }) : h("div", { style: { height: "240px" } }, " "),
                (game.currentPlayer == null)? 
                opponent? 
                    h("button", { class: ["button", "button-1", "button-block", "pad-1"], onClick: ()=> this.resetGame() }, "Play / Restart") : 
                    h("p", { class: ["text-center"] }, "Waiting for opponent...") :
                h("p", { class: ["mar-b-05", "text-center"] }, [
                    h("span", { style: { "display": "inline-block", "min-width": "7rem", "margin-right": "0.5rem" } }, "Elapsed time:"), 
                    h("span", { style: { "display": "inline-block", "min-width": "5rem" } }, `${(elapsedTime / 60000) | 0}m ${((elapsedTime / 1000) | 0) % 60}s`)
                ])
            ])
        ]
    }
}

