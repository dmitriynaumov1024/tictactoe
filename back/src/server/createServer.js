import fs from "node:fs"
import http from "node:http"
import https from "node:https"
import { createExpress } from "./createExpress.js"
import { createWebSocket } from "./createWebSocket.js"

export function createServer (options) {
    let server = null
    let serverOptions = { }
    let express = createExpress()
    if (options.https) {
        serverOptions.key = fs.readFileSync(options.key)
        serverOptions.cert = fs.readFileSync(options.cert)
        server = https.createServer(serverOptions, express)
        express.use((request, response, next)=> {
            if (request.secure) next()
            else response.redirect(`https://${request.hostname}${request.originalUrl}`)
        })
    }
    else {
        server = http.createServer(serverOptions, express)
    }
    let socket = createWebSocket(server)
    return {
        server: server,
        http: express,
        socket: socket,
        listen(...args) {
            return server.listen(...args)
        }
    }
}
