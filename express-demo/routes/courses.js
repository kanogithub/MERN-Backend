const Joi = require('joi')
const express = require('express')
const router = express.Router()

const courses = [
	{ id: 1, name: 'React.js' },
	{ id: 2, name: 'Node.js' },
	{ id: 3, name: 'Express.js' },
]

const validateCourse = (course) => {
	const schema = {
		name: Joi.string().min(3).required(),
	}

	return Joi.validate(course, schema)
}

// GET
router.get('/', (req, res) => res.send(courses))

// Params
router.get('/:id', (req, res) => {
	const course = courses.find((course) => course.id === +req.params.id)
	if (!course) res.status(404).send('The course with the given ID was not found!')

	res.send(course)
})

router.get('/:year/:month', (req, res) => res.send(req.params))

router.get('/query', (req, res) => res.send(req.query))

// POST
router.post('/courses', (req, res) => {
	const { error } = validateCourse(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	const course = {
		id: courses.length + 1,
		name: req.body.name,
	}

	courses.push(course)
	res.send(course)
})

// PUT
router.put('/:id', (req, res) => {
	const index = courses.findIndex((course) => course.id === +req.params.id)
	if (index === -1) return res.status(404).send('This course can not be found')

	const { error } = validateCourse(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	res.send((courses[index] = { ...courses[index], ...req.body }))
})

// DELETE
router.delete('/:id', (req, res) => {
	const index = courses.findIndex((course) => course.id === +req.params.id)
	if (index === -1) return res.status(404).send('This course can not be found')

	const deletedItem = courses.splice(index, 1)
	res.send(deletedItem)
})

module.exports = router
