import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

export default defineConfig({
    plugins: [ 
        vue()
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            // "@lib": fileURLToPath(new URL("./lib", import.meta.url)),
            "@style": fileURLToPath(new URL("./style", import.meta.url))
        }
    },
    build: {
        target: "es2015",
        outDir: "../back/dist",
        emptyOutDir: true
    },
    esbuild: {
        charset: "utf8"
    }
})
