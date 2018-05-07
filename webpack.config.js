const webpack = require("webpack");
const OfflinePlugin = require("offline-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: [
        './src/main.tsx',
        './src/global.scss'
    ],
    output: {
        filename: "bundle.[chunkhash].js",
        path: __dirname + "/dist",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    plugins: [
        new webpack.DefinePlugin({
            __PROD__: JSON.stringify(process.env.NODE_ENV === "PROD"),
        }),
        new OfflinePlugin({
            caches: {
                main: [":rest:"],
            },
            ServiceWorker: {
                output: "sw.js",
                publicPath: "/sw.js",
                cacheName: "anontown",
                minify: true,
            },
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: 'index.html'
        }),
        new CleanWebpackPlugin(['dist']),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.html?$/,
                loader: "html-loader"
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.s?css$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader?modules"
                    },
                    {
                        loader: "sass-loader"
                    }
                ]
            }
        ]
    },
    devServer: {
        contentBase: 'public',
        port: 3000,
        historyApiFallback: {
            index: 'index.html'
        },
        host: '0.0.0.0',
        disableHostCheck: true
    },
};
