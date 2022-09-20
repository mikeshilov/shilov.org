const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, '../public_html/cmd2'),
        filename: 'bundle.js',
        clean: true,
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
            { test: /\.js$/, loader: "source-map-loader" },
            { test: /\.css$/i, use: ["style-loader", "css-loader"] },
            { test: /\.(htaccess)$/, type: "asset/resource", generator: { filename: "[file]" } }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'index.html'),
        }),
        new FaviconsWebpackPlugin({
            logo: path.resolve(__dirname, 'logo.svg'),
            mode: 'webapp',
            cache: true,
            favicons: {
                appName: 'cmd',
                appShortName: 'CMD',
                developerName: 'Mike',
                developerURL: null,
                start_url: "https://shilov.org/cmd2/",
                background: '#ffffff',
                theme_color: '#ffffff',
                icons: {
                    favicons: true,
                    android: true,
                    yandex: true,
                    appleIcon: false,
                    windows: false,
                    appleStartup: false
                }
            }
        }),
    ],
};