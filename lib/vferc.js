'use strict';

var mkdirp = require('mkdirp')
var fs = require('fs')
var path = require('path')
var config = require('../config')
var dir = config.rc_dir
var vferc_profile = path.join(dir, '.vferc_profile')
var default_rc = path.join(dir, 'default')
/**
 * Create when init
 */
mkdirp.sync(dir)

if (!fs.existsSync(vferc_profile)) {
	fs.writeFileSync(vferc_profile, '', 'utf-8')
}
if (!fs.existsSync(default_rc)) {
	fs.writeFileSync(default_rc, '', 'utf-8')
}


function existRc (name) {
	return fs.existsSync(path.join(dir, name))
}
function readRc (name) {
	return conf2map(fs.readFileSync(path.join(dir, name), 'utf-8'))
}

function writeRc (name, content) {
	if (typeof content === 'object') {
		var keys =Object.keys(content)
		content = keys.map(function (k) {
			return k + '=' + content[k]
		}).join('\n')
	}
	return fs.writeFileSync(path.join(dir, name), content, 'utf-8')
}

function conf2map (content) {
	var r = {}
	content.split(/\r?\n/).forEach(function (line) {
		line = line.trim()
		if (line) {
			line = line.match(/^([\w\-\$\.]+)=(.+)/)
			if (line) r[line[1]] = line[2]
		}
	})
	return r
}

module.exports = {
	/**
	 * Set current rc or create it
	 */
	use: function (name) {
		var profile = readRc(vferc_profile)
		profile['selected'] = name
		writeRc(vferc_profile, profile) 
		return this
	},
	add: function (key, value) {
		var current = this.current()
		var rc = readRc(current)
		rc[key] = value
		return this
	},
	remove: function (key) {
		var current = this.current()
		var rc = readRc(current)
		delete rc[key]
		return this
	},
	current: function () {
		var profile = readRc(vferc_profile)
		return profile.selected || 'default'
	},
	dir: dir
}