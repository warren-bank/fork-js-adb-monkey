const Path = require('path');

module.exports = (() => { switch (Path.extname(__filename)) {
  case '.coffee': return require('./src/monkey');
  default: return require('./lib/monkey');
} })();
