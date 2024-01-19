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
            standalone: {
                createSize: 3
            },
            online: {
                createSize: 3,
                gameId: ""
            }
        }
    },
    methods: {
        createStandaloneGame() {
            this.client.emit("createGame", { size: this.standalone.createSize, standalone: true })
        },
        createOnlineGame() {
            this.client.emit("syncTime", null)
            this.client.emit("createGame", { size: this.online.createSize })
        },
        updateGameId() {
            this.online.gameId = this.$refs.gameIdInput.value
        },
        joinGame(id) {
            this.client.emit("syncTime", null)
            this.client.emit("joinGame", id)
        },
        refreshLobby() {
            this.client.emit("joinLobby", null)
        },
        standaloneSize(diff) {
            let newSize = this.standalone.createSize + diff
            if (newSize >= minBoardSize && newSize <= maxBoardSize) this.standalone.createSize = newSize
        },
        onlineSize(diff) {
            let newSize = this.online.createSize + diff
            if (newSize >= minBoardSize && newSize <= maxBoardSize) this.online.createSize = newSize
        },
    },
    render() {
        let { player, lobby } = this.clientData
        return [
            h("div", { class: ["card-card", "pad-05", "mar-b-05"] }, [
                h("h3", { class: ["mar-b-05"] }, "Logged in"),
                h("p", { class: ["mar-b-05"] }, `as ${player.name} with id ${player.id}`),
            ]),
            h("div", { class: ["card-card", "pad-05", "mar-b-05"] }, [
                h("h3", { class: ["mar-b-05"] }, "Create standalone game"), 
                h("p", { class: ["mar-b-05", "flex-grow", "text-gray"] }, "You will be redirected to new standalone Tic-Tac-Toe game where you can practice all by yourself or with a friend."),
                h("div", { class: ["flex-stripe", "flex-pad-05"] }, [
                    h("button", { class: ["button", "button-2", "accent-weak", "text-gray"], onClick: ()=> this.standaloneSize(-1) }, "–"),
                    h("span", { class: ["button", "button-2", "accent-weak", "text-gray", "flex-grow"] }, `Size: ${this.standalone.createSize}x${this.standalone.createSize}`),
                    h("button", { class: ["button", "button-2", "accent-weak", "text-gray"], onClick: ()=> this.standaloneSize(+1) }, "+"),
                    h("button", { class: ["button", "button-1", "min-width-6"], onClick: ()=> this.createStandaloneGame()  }, "Create")
                ])
            ]),
            h("div", { class: ["card-card", "pad-05", "mar-b-05"] }, [
                h("h3", { class: ["mar-b-05"] }, "Create new online game"), 
                h("p", { class: ["mar-b-05", "flex-grow", "text-gray"] }, "You will be redirected to new online Tic-Tac-Toe game."),
                h("div", { class: ["flex-stripe", "flex-pad-05"] }, [
                    h("button", { class: ["button", "button-2", "accent-weak", "text-gray"], onClick: ()=> this.onlineSize(-1) }, "–"),
                    h("span", { class: ["button", "button-2", "accent-weak", "text-gray", "flex-grow"] }, `Size: ${this.online.createSize}x${this.online.createSize}`),
                    h("button", { class: ["button", "button-2", "accent-weak", "text-gray"], onClick: ()=> this.onlineSize(+1) }, "+"),
                    h("button", { class: ["button", "button-1", "min-width-6"], onClick: ()=> this.createOnlineGame()  }, "Create")
                ])
            ]),
            h("div", { class: ["card-card", "pad-05", "mar-b-05"] }, [
                h("div", { class: ["flex-stripe", "mar-b-05"] }, [ 
                    h("h3", { class: ["flex-grow"] }, "Select a game to join"),
                    h("button", { class: ["button", "button-2", "text-gray", "accent-weak"], onClick: ()=> this.refreshLobby() }, "\u21bb")
                ]),
                h("div", { class: ["flex-stripe", "flex-pad-05", "mar-b-05"] }, [
                    h("div", { class: ["fancy-input", "mar-0", "flex-grow"] }, [
                        h("input", { type: "text", ref: "gameIdInput", placeholder: "Game id", value: this.online.gameId, onChange: ()=> this.updateGameId() })
                    ]),
                    h("button", { class: ["button", "button-1", "min-width-6"], onClick: ()=> this.joinGame(this.online.gameId) }, "Join")
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
