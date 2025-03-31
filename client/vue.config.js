const { defineConfig } = require('@vue/cli-service');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

module.exports = defineConfig({
    outputDir: isProd ? path.resolve(__dirname, '../dist') : undefined,
    assetsDir:  isProd ? 'resources' : undefined, // Store assets in dist/resources
    publicPath: isProd ? '/app/' : undefined,  // Ensures requests are prefixed with /app
    productionSourceMap: !isProd, // Disable source maps in production for smaller build size
  /*  configureWebpack: isProd ? {
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin({
                    terserOptions: {
                        compress: true,
                        mangle: true,
                        output: {
                            comments: false, // Remove comments
                        },
                        keep_classnames: false,
                        keep_fnames: false,
                    },
                }),
            ],
        },
    } : {},*/
    devServer: isProd ? undefined : {
        proxy: {
            '/api/rest/*': {
                target: 'http://localhost:3000',
                secure: false,
                headers: {
                    // 'Authorization': `Basic ${AUTH_TOKEN}`,
                }
            }
        }
    },
    transpileDependencies: [
        'vuetify'
    ]
});
