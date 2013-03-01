var path = require('path');
var child_process = require('child_process');

module.exports = install;

function install(filename) {
  console.log('Installing components specified in component-shrinkwrap.json...');

	var wrap = require(path.resolve(process.cwd(), filename));
	var args = wrap.components.map(function(c) {
		return [c.name, c.version].join('@');
	});
	var child = child_process.spawn('component-install', args);
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
}