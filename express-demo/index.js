const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const authenticator = require('./customMiddleware/authenticator')

const home = require('./routes/home')
const courses = require('./routes/courses')

// Third-part middelware
const helmet = require('helmet')
const morgan = require('morgan')

// Configuration
const config = require('config')

// DEBUG between different namespace
const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')

// setting PUG
app.set('view engine', 'pug')
app.set('views', './views') // defaults

// use Build-in middleware
app.use(express.json())
// app.use(express.urlencoded({ extended: true}))
// app.use(express.static('public'))

// use Third-party middleware
if (app.get('env') === 'development') {
	// Third-parties
	app.use(helmet()) // for secure header
	app.use(morgan('tiny')) // for log request
}

if (app.get('env') === 'testing') {
	console.log('\n=================')
	console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
	console.log(`app: ${app.get('env')}`)
	console.log('=================\n')

	// use Configuration
	console.log('Application Name:', config.get('name'))
	console.log('Mail Server:', config.get('mail.host'))
	console.log('Mail Password:', config.get('mail.password'))

	// use Debug
	process.env.DEBUG = ''
	startupDebugger('Morgan enabled...')
	dbDebugger('Connected to the database...')
}

// Try custom middleware function
app.use(authenticator)

// Express endpoints
// use Router - home
app.use('/', home)
// use Router - courses
app.use('/api/courses', courses)

// listening
app.listen(port, () => console.log(`Start listening on port ${port}!`))
