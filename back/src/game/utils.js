import crypto from "node:crypto"

export function randomId () {
    return crypto.randomUUID().slice(-8)
}

export function probability (p) {
    if (p <= 0) return false
    if (p >= 1) return true
    return Math.random() < p
}

export function eventHandler (object) {
    object.handlers ??= { }
    object.on = function (topic, handler) {
        this.handlers[topic] = handler
    }
    object.handle = function (...args) {
        let topic = null, data = null
        if (args.length >= 2) {
            topic = args[0]
            data = args[1]
        }
        else {
            let message = JSON.parse(args[0])
            topic = message.topic
            data = message.data
        }
        let handler = this.handlers[topic]
        if (handler instanceof Function) return handler.call(this, data)
    }
    return object
}
