[![Dependency Status](https://gemnasium.com/code42day/component-shrinkwrap.png)](https://gemnasium.com/code42day/component-shrinkwrap)
[![NPM version](https://badge.fury.io/js/component-shrinkwrap.png)](http://badge.fury.io/js/component-shrinkwrap)
# component-shrinkwrap


Shrinkwrap for component build system. Similar to [npm shrinkwrap][].
Saves and recreates your `components` directory.
Keeps list of components and their versions in `component-shrinkwrap.json`

## Install

    npm install -g component component-shrinkwrap

## Usage

To save component-shrinkwrap.json file

    component shrinkwrap --save


To install components references in the shrinkwrap file

    component shrinkwrap --install

When no options are passed, `component shrinkwrap` assumes `--save` if `components` directory
exists, and `--install` if it doesn't.

## License

MIT

[npm shrinkwrap]: https://npmjs.org/doc/shrinkwrap.html
