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
                ws: true,
            }
        },
        // https: true,
        port: 8080
    }
}
