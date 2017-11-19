const webpack = require("webpack");

module.exports = {
    entry: './src/main.tsx',
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist",
    },
    devtool: "source-map",
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    plugins: [
        new webpack.DefinePlugin({
            __PROD__: JSON.stringify(process.env.NODE_ENV === "PROD"),
        })
    ],
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    devServer: {
        contentBase: 'public',
        port: 3000,
        historyApiFallback: {
            index: 'index.html'
        }
    },
};