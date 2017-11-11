const Clean = require('clean-webpack-plugin');
const Uglify = require('uglifyjs-webpack-plugin');

const {
    PATH_DIST,
} = require('./webpack.config');
module.exports = require('./webpack.dev.js');

module.exports.plugins.unshift(new Clean([PATH_DIST], { root: process.cwd(), verbose: false }));
module.exports.plugins.push(new Uglify());
