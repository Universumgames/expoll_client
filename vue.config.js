/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
// eslint-disable-next-line no-undef
module.exports = {
    devServer: {
        proxy: {
            "^/api": {
                target: "http://localhost:6060",
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    "^/api": ""
                }
            },
            "^/swagger": {
                target: "http://localhost:6060",
                changeOrigin: true,
                ws: true
            }
        },
        // https: true,
        port: 8080
    },
    pwa:{
        assetsVersion: "1",
        appleMobileWebAppCapable: "no",
        workboxPluginMode: "InjectManifest",
        workboxOptions: {
            swSrc: "./src/service-worker.ts"
        },
        manifestOptions: {
            name: "Expoll",
            short_name: "Expoll",
            themeColor: "#2c3e50",
            background_color: "#2c3e50",
            start_url: "/#/polls?version=" + process.env.VUE_APP_VERSION,
            shortcuts:[
                {
                    name: "Poll list",
                    short_name: "Polls",
                    description: "List of all polls",
                    url: "/#/polls"
                },
                {
                    name: "User info",
                    short_name: "User",
                    description: "User info",
                    url: "/#/account"
                }
            ],
            icons: []
        },
        iconPaths: {
            faviconSVG: null,
            favicon32: "app_icons/mac32.png",
            favicon16: "app_icons/mac16.png",
            appleTouchIcon: "app_icons/ipad152.png"
        }
    }
    //publicPath: ""
}
