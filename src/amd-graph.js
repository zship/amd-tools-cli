'use strict';


var path = require('path');

var normalize = require('libamd/modules/normalize');
var getDependencyGraph = require('libamd/getDependencyGraph');
var linearize = require('libamd/graphs/linearize');
require('colors');

var parseOpts = require('./util/parseOpts');
var parseConfig = require('./util/parseConfig');
var resolveFileArgs = require('./util/resolveFileArgs');
var log = require('./util/log');


var _opts = {
	'linearize': {
		type: Boolean,
		shortHand: 'l'
	},
	'reverse': {
		type: Boolean,
		shortHand: 'r'
	},
	'normalize': {
		type: Boolean
	},
	'resolve': {
		type: Boolean
	}
};


var amdGraph = function() {
	var args = process.argv.slice(3);
	var opts = parseOpts(_opts, args, 0);
	var rjsconfig = parseConfig();
	var files = resolveFileArgs(opts.argv.remain, rjsconfig);

	var nodes = [];
	files.forEach(function(file) {
		nodes.push(getDependencyGraph(rjsconfig, file));
	});

	var displayName = function(node) {
		if (opts.normalize) {
			return normalize(rjsconfig, node.file);
		}
		else if (opts.resolve) {
			return node.file;
		}
		else {
			return path.relative('.', node.file);
		}
	};

	var sorted = linearize(nodes);

	if (opts.reverse) {
		sorted = sorted.reverse();
	}

	sorted.forEach(function(node) {
		if (opts.linearize) {
			log.writeln(displayName(node));
		}
		else {
			node.deps.forEach(function(dep) {
				log.writeln(displayName(node) + ' ' + displayName(dep));
			});
		}
	});
};


module.exports = amdGraph;
