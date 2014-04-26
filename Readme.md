[![Dependency Status](https://img.shields.io/gemnasium/code42day/component-shrinkwrap.svg)](https://gemnasium.com/code42day/component-shrinkwrap)
[![NPM version](https://img.shields.io/npm/v/component-shrinkwrap.svg)](https://www.npmjs.org/package/component-shrinkwrap)
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

### Other options

#### `--check`

If `check` is enabled we will verify if packages can be re-installed     reliably and warn if
problems are found

There are 2 kinds of problems that are detected if you use this option:

- version in component.json file is not the same as tagged version: warning is printed but
shrinkwrap will still generate unchanged `component-shrinkwrap.json`

- version in component.json is not tagged at all: it is reset to '*' in the shrinkwrap file which
causes master to be installed

In both cases the best course of action is to notify the component owner and ask for the component
to be properly tagged.

#### `--long`

If you used `component-shrinkwrap` before 0.6 version you may have an older format of the
`component-shrinkwrap.json` file in your version control system. Use `--long` option to preserve it.

New (short) format uses a single dependencies object with component names as keys and component
versions as value. This is the same format that is used in `package.json` and `component.json`.

Older (long) format keeps information as a list of objects with `name` and `version` properties.

Both formats are supported and automatically detected during `--install` - this option is only
needed for `--save` phase.

## License

MIT

[npm shrinkwrap]: https://npmjs.org/doc/shrinkwrap.html
