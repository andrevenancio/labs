const path = require('path');
const parsing = require('./parsing');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const {
    NAME,
    PATH_DIST,
    PATH_SOURCE,
} = require('./webpack.config');

module.exports = {
    cache: true,
    devtool: 'source-map',

    entry: parsing.getEntries(),

    output: {
        path: path.join(process.cwd(), PATH_DIST),
        filename: 'js/[name].js',
        chunkFilename: 'js/[name].js',
    },

    devServer: {
        contentBase: path.join(process.cwd(), PATH_DIST),
    },

    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
        ],
    },

    plugins: [
        new HtmlWebpackPlugin({
            filename: path.join(process.cwd(), PATH_DIST, 'index.html'),
            template: path.join(process.cwd(), PATH_SOURCE, 'template.ejs'),
            inject: false,
            title: NAME,
            paths: parsing.getPaths(),
        }),
        new CopyWebpackPlugin([{
            from: path.join(process.cwd(), PATH_SOURCE, '_static'), to: path.join(process.cwd(), PATH_DIST),
        }]),
        ...parsing.getPlugins(),
    ],

};
