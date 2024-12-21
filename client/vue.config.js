const {defineConfig} = require('@vue/cli-service')
module.exports = defineConfig({
    devServer: {
        proxy: {
            "/api/rest/*": {
                target: "http://localhost:3000",
                secure: false,
                headers: {
                    //'Authorization': `Basic ${AUTH_TOKEN}`,
                }
            },
        },
    },
    transpileDependencies: [
        'vuetify'
    ]
})
