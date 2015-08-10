'use strict';

var path = require('path') 

var ENV = process.env

module.exports = {
	rc_dir: path.join(ENV.APPDATA || ENV.HOME || __dirname, '.vfercs')
}