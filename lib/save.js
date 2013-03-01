var path = require('path')
  , fs = require('fs')
  , exists = fs.existsSync
  , readdir = fs.readdirSync
  , writeFile = fs.writeFileSync;

module.exports = save;

function save(filename) {
  console.log('Saving component-shrinkwrap.json...');
  var wrap = {
    components: list('components')
  };
  writeFile(filename, JSON.stringify(wrap, null, 2));
}


function lookup(file, dir) {
  var f = path.join(dir, file);
  if (exists(f)) {
    return f;
  }
}

/**
 * Search `dir` for installed components.
 *
 * @param {String} dir
 * @return {Object}
 */
function list(dir) {
  return readdir(dir).map(function(d) {
    var file = lookup('component.json', path.join(dir, d));
    if (!file) {
      console.log('Cannot find:', d);
      return;
    }
    var conf = require(path.resolve(file));
    return {
      name: d.replace('-', '/'),
      version: conf.version,
    };
  }).filter(function (spec) {
    return spec;
  });
}
