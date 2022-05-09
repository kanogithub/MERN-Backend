// practice event emitter

const Logger = require('./logger')
const logger = new Logger()

// Register a listener
logger.on('messageLogged', (args) => {
	console.log(`Listener Called:`, args)
})

// Raise an Event
logger.emit('messageLogged', { id: 2, data: 'testing' })

// Call log to raise event
logger.log('Logging Data')
