import Client from "./game/Client.js"
import MainView from "./comp/MainView.js"
import { createApp, h, reactive } from "vue"

function sleep(ms) {
    return new Promise(resolve => setTimeout(()=> resolve(), ms))
}

let client
let clientData = reactive({ time: 0 })
try {
    client = Client.create("ws" + window.location.origin.slice("4")) // this is kinda stupid
}
catch(e) {
    clientData.error = e
}
setInterval(()=> { 
    clientData.time = Date.now() - (clientData.timeOffset ?? 0)
}, 300)

client.on("update", (newData)=> {
    Object.assign(clientData, newData)
})
client.on("notification", (notification)=> {
    clientData.notification = notification
})
client.on("syncTime", (time)=> {
    console.log("Sync time: " + time)
    clientData.timeOffset = Date.now() - time
})

let vueApp = createApp({
    render() {
        return h(MainView, { client, clientData })
    }
})

vueApp.mount("#app-root")
