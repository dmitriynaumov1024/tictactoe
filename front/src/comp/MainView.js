import { h } from "vue"

import LoginView from "./LoginView.js"
import LobbyView from "./LobbyView.js"
import GameView from "./GameView.js"

export default {
    props: {
        client: Object,
        clientData: Object
    },
    methods: {
        joinLobby() {
            this.client.emit("joinLobby", null)
        }
    },
    render() {
        let innerView
        let show = {
            login: !(this.clientData.player?.name),
            lobby: !(this.clientData.game),
            game: !!(this.clientData.game)
        }
        if (show.login) innerView = h(LoginView, this.$props)
        else if (show.lobby) innerView = h(LobbyView, this.$props)
        else innerView = h(GameView, this.$props)
        return [
            h("header", { class: ["header", "mar-b-1"] }, [
                h("div", { class: ["width-container", "pad-05"] }, [
                    h("h2", { class: ["clickable"], onClick: ()=> { if (show.game) this.joinLobby() } }, "Tic-Tac-Toe")
                ])
            ]),
            h("main", { class: ["main"] }, [
                h("div", { class: ["width-container", "pad-05"] }, [
                    innerView,
                    this.clientData.error? 
                    h("p", { class: ["text-error", "text-pre"] }, this.clientData.error) : null
                ])
            ])
        ]
    }
}
