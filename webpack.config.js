const webpack = require("webpack");

module.exports = {
    entry: [
        './src/main.tsx',
        './src/main.scss'
    ],
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
        loaders: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.scss$/,
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
        }
    },
};