const http = require('http')

const Logger = require('./logger')
const logger = new Logger()
const log = logger.log
logger.on('messageLogged', (url) => {
	console.log('Emitter Call in ', url)
})

// server is actually a event emitter
const server = http.createServer((req, res) => {
	if (req.url === '/') {
		res.write('Hellow World')
		res.end()

		logger.log('send hellow world', req.url)
	}

	if (req.url === '/courses') {
		res.write(JSON.stringify(['UX', 'Node.js', 'React.js']))
		res.end()

		logger.log('send courses', req.url)
	}
})

// server.on('connection', (socket) => {
// 	console.log('New connection...')
// })

server.listen(3000)

console.log('Listening on port 3000...')
