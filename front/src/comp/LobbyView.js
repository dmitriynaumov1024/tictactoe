import { h } from "vue"

const minBoardSize = 2,
      maxBoardSize = 5

export default {
    props: {
        client: Object,
        clientData: Object
    },
    data() {
        return {
            createSize: 3
        }
    },
    methods: {
        createGame() {
            this.client.emit("syncTime", null)
            this.client.emit("createGame", { size: this.createSize })
        },
        joinGame(id) {
            this.client.emit("syncTime", null)
            this.client.emit("joinGame", id)
        },
        refreshLobby() {
            this.client.emit("joinLobby", null)
        },
        createSizeMinus() {
            if (this.createSize > minBoardSize) this.createSize -= 1
        },
        createSizePlus() {
            if (this.createSize < maxBoardSize) this.createSize += 1
        }
    },
    render() {
        let { player, lobby } = this.clientData
        return [
            h("div", { class: ["card-card", "pad-05", "mar-b-05"] }, [
                h("h3", { class: ["mar-b-05"] }, "Logged in"),
                h("p", { class: ["mar-b-05"] }, `as ${player.name} with id ${player.id}`),
            ]),
            h("div", { class: ["card-card", "pad-05", "mar-b-05"] }, [
                h("h3", { class: ["mar-b-05"] }, "Create new game"), 
                h("p", { class: ["mar-b-05", "flex-grow", "text-gray"] }, "You will be redirected to new Tic-Tac-Toe game."),
                h("div", { class: ["flex-stripe", "flex-pad-05"] }, [
                    h("button", { class: ["button", "button-2", "accent-weak", "text-gray"], onClick: ()=> this.createSizeMinus() }, "–"),
                    h("span", { class: ["button", "button-2", "accent-weak", "text-gray", "flex-grow"] }, `Size: ${this.createSize}x${this.createSize}`),
                    h("button", { class: ["button", "button-2", "accent-weak", "text-gray"], onClick: ()=> this.createSizePlus() }, "+"),
                    h("span", { class: ["flex-grow"] }, " "),
                    h("button", { class: ["button", "button-1"], onClick: ()=> this.createGame()  }, "Create")
                ])
            ]),
            h("div", { class: ["card-card", "pad-05", "mar-b-05"] }, [
                h("div", { class: ["flex-stripe", "mar-b-05"] }, [ 
                    h("h3", { class: ["flex-grow"] }, "Select a game to join"),
                    h("button", { class: ["button", "button-2", "text-gray", "accent-weak"], onClick: ()=> this.refreshLobby() }, "\u21bb")
                ]),
                h("div", { class: ["mar-b-05"] }, (lobby?.length > 0) ?
                    lobby.map(game => {
                        return h("div", { class: ["clickable", "mar-b-05", "card", "pad-v-05"], onClick: ()=> this.joinGame(game.id) }, [
                            h("p", { class: ["text-bold"] }, `${game.size}x${game.size} Game with id ${game.id}`),
                            h("p", { class: ["text-gray"] }, `${game.players.find(p => p)?.name ?? "Nobody"} is there`)
                        ])
                    }) :
                    h("div", { class: ["pad-v-05"] }, "Sorry, there are no available games at this moment.")
                )
            ])
        ]
    }
}
