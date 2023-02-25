const Joi = require('joi')
const express = require('express')
const app = express()

app.use(express.json())

const genres = [
	{ id: 1, name: 'Action' },
	{ id: 2, name: 'Horror' },
	{ id: 3, name: 'Romance' },
]

app.get('/api/genres', (req, res) => {
	res.send(genres)
})

app.get('/api/genres/:id', (req, res) => {
	const genre = genres.find((item) => item.id === parseInt(req.params.id))
	if (!genre) return res.status(404).send('Do not have this genre')

	res.send(genre)
})

app.post('/api/genres', (req, res) => {
	const { error } = validateGenres(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	const genre = {
		id: genres.length + 1,
		...req.body,
	}
	genres.push(genre)
	res.send(genre)
})

app.put('/api/genres/:id', (req, res) => {
	const genre = genres.find((item) => item.id === parseInt(req.params.id))
	if (!genre) return res.status(404).send('Do not have this genre')

	const { error } = validateGenres(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	genre.name = req.body.name
	res.send(genre)
})

app.delete('/api/genres/:id', (req, res) => {
	const genre = genres.find((item) => item.id === parseInt(req.params.id))
	if (!genre) return res.status(404).send('Do not have this genre')

	const index = genres.indexOf(genre)
	genres.splice(index, 1)

	res.send(genre)
})

const validateGenres = (genre) => {
	const schema = {
		name: Joi.string().min(3).required(),
	}

	return Joi.validate(genre, schema)
}

app.listen(3000, () => {
	console.log('Genres Server is listening...')
})
