var path = require('path');
var component = require('component');
var utils = component.utils;
var log = utils.log;
var error = utils.error;

module.exports = install;


// copied from component/bin/component-install
function report(pkg, options) {
  options = options || {};
  if (pkg.inFlight) return;
  log('install', pkg.name + '@' + pkg.version);

  pkg.on('error', function(err){
    if (404 != err.status) utils.fatal(err.stack);

    if (err.fatal) {
      error(err.message);
      process.exit(1);
    }
  });

  pkg.on('dep', function(dep){
    log('dep', dep.name + '@' + dep.version);
    report(dep, options);
  });

  pkg.on('exists', function(dep){
    log('exists', dep.name + '@' + dep.version);
  });

  pkg.on('file', function(file){
    log('fetch', pkg.name + ':' + file);
  });

  pkg.on('end', function(){
    log('complete', pkg.name);
  });
}

function install(filename) {
  console.log('Installing components specified in component-shrinkwrap.json...');

  var wrap = require(path.resolve(filename));
  var conf = require(path.resolve('component.json'));

  conf.remotes = conf.remotes || [];
  conf.remotes.push('https://raw.github.com');
  wrap.components.forEach(function(c) {

    var pkg = component.install(c.name, c.version, {
      remotes: conf.remotes
    });

    report(pkg);

    pkg.install();
  });
}