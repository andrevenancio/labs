const pkg = require('../package.json');

const NAME = pkg.name;
const PATH_DIST = 'build';
const PATH_SOURCE = 'src';
const VERSION = JSON.stringify(pkg.version);

module.exports = {
    NAME,
    PATH_DIST,
    PATH_SOURCE,
    VERSION,
};
