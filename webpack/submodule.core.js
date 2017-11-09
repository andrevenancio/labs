const path = require('path');
const webpack = require('webpack');
const submodule = require('../lowww-core/package.json');
const {
    PATH_DIST,
    PATH_SOURCE,
} = require('./webpack.config');

const SUBMODULE_NAME = submodule.name;
const SUBMODULE_VERSION = submodule.version;

module.exports = {
    entry: {
        [SUBMODULE_NAME]: path.join(process.cwd(), SUBMODULE_NAME, PATH_SOURCE, 'index.js'),
    },

    output: {
        path: path.join(process.cwd(), SUBMODULE_NAME, PATH_DIST),
        filename: '[name].js',
        chunkFilename: '[name].js',
        library: SUBMODULE_NAME.split('-'),
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },

    devServer: {
        contentBase: path.join(process.cwd(), SUBMODULE_NAME, PATH_DIST),
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
        new webpack.DefinePlugin({
            __LIBRARY__: JSON.stringify(`${SUBMODULE_NAME}`),
            __VERSION__: JSON.stringify(SUBMODULE_VERSION),
        }),
    ],
};
