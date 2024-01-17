function createClient (baseURL) {
    let socket = new WebSocket(baseURL)
    let handlers = { }
    socket.addEventListener("message", (message)=> {
        try {
            let { topic, data } = JSON.parse(message.data)
            let handler = handlers[topic]
            if (handler instanceof Function) handler(data)
        }
        catch (error) {
            // ignore
        }
    })
    return {
        // send to server
        emit (topic, data) {
            socket.send(JSON.stringify({ topic, data }))
        },
        on (topic, handler) {
            handlers[topic] = handler
        }
    }
}

export default {
    create: createClient
}
