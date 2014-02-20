var path = require('path');
var Installer = require('component-installer');

module.exports = install;


// copied from component/bin/component-install
function report(pkg, options) {
  options = options || {};
  if (pkg.inFlight) return;
  log('install', pkg.name + '@' + pkg.version);

  pkg.on('error', function(err){
    if (404 != err.status) fatal(err.stack);

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

  var deps = require(path.resolve(filename)).components;
  var installer = new Installer(path.dirname(filename));

  installer.on('package', report);
  deps.forEach(function (dep) {
    installer.installPackage(dep.name, dep.version);
  });
}

/**
 * Output fatal error message and exit.
 *
 * Taken from component/lib/utils.js
 *
 * @param {String} msg
 * @api private
 */

function fatal() {
  console.error();
  error.apply(null, arguments);
  console.error();
  process.exit(1);
}

/**
 * Log the given `type` with `msg`.
 *
 * Slightly modified version of component/lib/utils.js
 *
 * @param {String} type
 * @param {String} msg
 * @api public
 */

function log(type, msg) {
  var color = 'error' == type
    ? '31'
    : '36';

  var w = 10;
  var len = Math.max(0, w - type.length);
  var pad = Array(len + 1).join(' ');
  var fmt = '  \033[' + color + 'm%s\033[m : \033[90m%s\033[m';
  if ('error' == type) {
    console.error(fmt, pad + type, msg);
  } else {
    console.log(fmt, pad + type, msg);
  }
}

/**
 * Output error message.
 *
 * Slightly modified version of component/lib/utils.js
 *
 * @param {String} msg
 * @api private
 */

function error(msg) {
  log('error', msg);
}
