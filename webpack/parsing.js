const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const {
    PATH_DIST,
    PATH_SOURCE,
} = require('./webpack.config');

const api = {

    // gets list of all the folders inside with a valid index.js inside
    getList: () => {
        return glob.sync(path.join(process.cwd(), PATH_SOURCE, '**/*.js')).filter((entry) => {
            const temp = entry.replace(path.join(process.cwd(), PATH_SOURCE), '').split('/');

            // example doesnt have its own folder
            if (temp.length < 3) {
                console.warn('[warning]:', 'examples needs to have their own folder\n[skipping]:', entry, '\n');
                return false;
            }

            // entry point can only be index.js,
            if (temp[temp.length - 1] === 'index.js') {
                return true;
            }

            // only index.js qualifies as valid entry point
            return false;
        });
    },

    // returns list of entry points
    getEntries: () => {
        return api.getList().reduce((entries, entry) => {
            const structure = entry.replace(path.join(process.cwd(), PATH_SOURCE), '').split('/');
            return Object.assign(entries, { [structure[structure.length - 2].replace('.js', '')]: entry });
        }, {});
    },

    getPluginsStructure: () => {
        return api.getList().map((entry) => {
            return entry.replace(path.join(process.cwd(), PATH_SOURCE), '').split('/');
        });
    },

    // returns list of HtmlWebpackPlugin all with custom per example
    getPlugins: () => {
        return Object.keys(api.getEntries()).map((key) => {
            return new HtmlWebpackPlugin({
                filename: path.join(process.cwd(), PATH_DIST, `${key}.html`),
                template: path.join(process.cwd(), PATH_SOURCE, 'template.ejs'),
                inject: false,
                minify: {
                    collapseWhitespace: false,
                    minifyCSS: true,
                },
                title: key,
            });
        });
    },

    // returns list of HTML paths for webpack-dev-server
    getPaths: () => {
        return api.getList().reduce((entries, entry) => {
            const key = entry.replace(path.join(process.cwd(), PATH_SOURCE), '').split('/')[1].replace('.js', '');
            if (key === '_lib') {
                return entries;
            }
            return Object.assign(entries, { [key]: `${key}.html` });
        }, {});
    },
};

module.exports = api;
