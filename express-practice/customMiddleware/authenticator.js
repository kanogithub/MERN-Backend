const authenticator = (req, res, next) => {
	console.log('Try Custom Middleware Authenticating...')

	// must use next() function to pass result to the next
	next()
}

module.exports = authenticator
