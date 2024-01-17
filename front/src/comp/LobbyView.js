import { h } from "vue"

export default {
    props: {
        client: Object,
        clientData: Object
    },
    methods: {
        createGame() {
            this.client.emit("syncTime", null)
            this.client.emit("createGame", null)
        },
        joinGame(id) {
            this.client.emit("syncTime", null)
            this.client.emit("joinGame", id)
        },
        refreshLobby() {
            this.client.emit("joinLobby", null)
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
                h("div", { class: ["flex-stripe", "flex-pad-05"] }, [
                    h("p", { class: ["flex-grow", "text-gray"] }, "You will be redirected to new Tic-Tac-Toe game."),
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
                            h("p", { class: ["text-bold"] }, `Game ${game.id}`),
                            h("p", { class: ["text-gray"] }, `${game.players.find(p => p)?.name ?? "Nobody"} is there`)
                        ])
                    }) :
                    h("div", { class: ["pad-v-05"] }, "Sorry, there are no available games at this moment.")
                )
            ])
        ]
    }
}
