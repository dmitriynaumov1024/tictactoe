import { h } from "vue"

export default {
    props: {
        client: Object,
        clientData: Object
    },
    methods: {
        proceedClick() {
            let name = this.$refs.nameInput.value
            if (name?.length > 1) {
                this.client.emit("setName", name)
                this.client.emit("joinLobby", null)
            }
        }
    },
    render() {
        return h("div", { class: ["card-card", "pad-05"] }, [
            h("h3", { class: ["mar-b-05"] }, "Log in"),
            h("p", { class: ["mar-b-1", "text-gray"] }, "There is no chance to play without logging in."),
            h("div", { class: ["flex-stripe", "flex-pad-05"] }, [
                h("div", { class: ["fancy-input", "mar-0", "flex-grow"] }, [
                    h("input", { ref: "nameInput" }),
                ]),
                h("button", { class: ["button", "button-1"], onClick: this.proceedClick }, "Log in")
            ])
        ])
    }
}
