var path = require('path');
var fs = require('fs');
var exists = fs.existsSync;
var readdir = fs.readdirSync;
var writeFile = fs.writeFileSync;

var Package = require('component-package');
var Batch = require('batch');

module.exports = registry;


function registry(dir) {
  var deps = list('components');
  Object.keys(deps).forEach(function(dep) {
    copy(dep, deps[dep], dir);
  });
}

function copy(component, version, dir) {
  var from, to;
  from = path.join('components', component.replace('/', '-'));
  to = path.join(dir, component, version);
  console.log('mkdir -p', to, '&&', 'cp -rp', from + '/* ', to);
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
