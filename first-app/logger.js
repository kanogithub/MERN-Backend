const EventEmitter = require('events')

var url = 'http://mylogger.io/log'

class Logger extends EventEmitter {
	log(message, caller = {}) {
		// Send an HTTP request
		console.log(message)

		// Raise an event
		this.emit('messageLogged', caller)
	}
}

module.exports = Logger
