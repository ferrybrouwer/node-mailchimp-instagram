require('babel-register')({
	presets: ['es2015', 'stage-0']
})
require('babel-polyfill')


const server = require('./server')
module.exports = server