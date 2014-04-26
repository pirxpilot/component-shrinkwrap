var path = require('path')
  , fs = require('fs')
  , exists = fs.existsSync
  , readdir = fs.readdirSync
  , writeFile = fs.writeFileSync;

module.exports = save;

function save(filename, options) {
  console.log('Saving component-shrinkwrap.json...');
  var deps = list('components'),
    wrap = { dependencies: deps };
  if (options.long) {
    // older format - list of component objects
    deps = Object.keys(deps).reduce(function(comps, dep) {
      comps.push({
        name: dep,
        version: deps[dep]
      });
      return comps;
    }, []);
    wrap = { components: deps };
  }
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
  return readdir(dir).reduce(function(deps, d) {
    var file = lookup('component.json', path.join(dir, d));
    if (!file) {
      console.log('Cannot find:', d);
      return;
    }
    var conf = require(path.resolve(file));
    if (conf) {
      deps[d.replace('-', '/')] = conf.version;
    }
    return deps;
  }, {});
}
