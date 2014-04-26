var path = require('path');
var fs = require('fs');
var exists = fs.existsSync;
var readdir = fs.readdirSync;
var writeFile = fs.writeFileSync;

var Package = require('component-package');
var Batch = require('batch');

module.exports = save;


function save(filename, options) {
  console.log('Saving component-shrinkwrap.json...');
  var deps = list('components');
  if (options.check) {
    verify(deps, function(err, deps) {
      write(filename, deps, options);
    });
  } else {
    write(filename, deps, options);
  }
}

function verify(deps, fn) {
  console.log('Verifying packages...');
  var batch = new Batch();

  Object.keys(deps).forEach(function(name) {
    batch.push(function(fn) {
      var version = deps[name],
        pkg = new Package(name, version);
      pkg.getJSON(function(err, json) {
        if (err) {
          console.error('%s cannot be reliably shrinkwrapped: setting version to *', name);
          deps[name] = '*';
        } else if (version !== json.version) {
          console.error('%s version discrepancy - tag %s vs. source %s', name, json.version, version);
        }
        fn();
      });
    });
  });

  batch.end(function() {
    fn(null, deps);
  });
}


function write(filename, deps, options) {
  var wrap = { dependencies: deps };
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
