'use strict';


var path = require('path');

var normalize = require('amd-tools/modules/normalize');
var resolve = require('amd-tools/modules/resolve');
var getDependencies = require('amd-tools/getDependencies');
require('colors');

var parseOpts = require('./util/parseOpts');
var parseConfig = require('./util/parseConfig');
var resolveFileArgs = require('./util/resolveFileArgs');
var log = require('./util/log');


var _opts = {
	'normalize': {
		type: Boolean,
		description: 'Convert verbatim dependencies into unique module IDs'
	},
	'resolve': {
		type: Boolean,
		description: 'Convert verbatim dependencies into resolved file paths'
	}
};


var deplist = function() {
	var args = process.argv.slice(3);
	var opts = parseOpts(_opts, args, 0);
	var rjsconfig = parseConfig();
	var files = resolveFileArgs(opts.argv.remain, rjsconfig);

	files.forEach(function(file) {
		log.verbose.write('\n' + path.relative(process.cwd(), file) + '\n');
		var deps = getDependencies(file, rjsconfig);
		if (!deps.length) {
			log.verbose.write('(None)\n');
		}
		if (opts.resolve) {
			deps = deps.map(function(dep) {
				return resolve(dep, path.dirname(file), rjsconfig);
			});
		}
		else if (opts.normalize) {
			deps = deps.map(function(dep) {
				return normalize(dep, rjsconfig);
			});
		}
		deps.forEach(function(dep) {
			log.writeln(dep);
		});
	});
};


module.exports = deplist;
