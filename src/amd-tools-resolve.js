'use strict';


var resolve = require('amd-tools/modules/resolve');

var parseOpts = require('./util/parseOpts');
var parseConfig = require('./util/parseConfig');
var resolveFileArgs = require('./util/resolveFileArgs');
var log = require('./util/log');


var _opts = {};


var resolve = function() {
	var args = process.argv.slice(3);
	var opts = parseOpts(_opts, args, 0);
	var rjsconfig = parseConfig();
	var files = resolveFileArgs(opts.argv.remain, rjsconfig);

	files.forEach(function(file) {
		log.writeln(file);
	});
};


module.exports = resolve;