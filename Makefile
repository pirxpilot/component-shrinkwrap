SRC=index.js lib/save.js lib/install.js bin/component-shrinkwrap

lint:
	@./node_modules/.bin/jshint $(SRC)

.PHONY: lint
