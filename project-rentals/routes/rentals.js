const { Rental, validate } = require('../models/rental')
const { Customer } = required('../models/customer')
const { Movie } = required('../models/movie')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
	const rental = await Rental.find().sort('-dateOut')
	res.send(rental)
})

router.post('/', async (req, res) => {
	const { error } = validate(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	const customer = await Customer.findById(req.body.customerId)
	if (!customer) return res.status(400).send('Invalid Customer.')
	const movie = await Movie.findById(req.body.movieId)
	if (!movie) return res.status(400).send('Invalid Movie.')

	if (movie.numberInStock === 0) return res.status(400).send('Movie no in stock.')

	let rental = new Rental({
		customer: {
			_id: customer._id,
			name: customer.name,
			phone: customer.phone,
		},
		movie: {
			_id: movie._id,
			title: movie.title,
			dailyRentalRate: movie.dailyRentalRate,
		},
		dateOut: req.body.dateOut,
	})
	rental = await rental.save()

	movie.numberInStock--
	movie.save()

	res.send(rental)
})

router.put('/:id', async (req, res) => {
	const { error } = validate(req.body)
	if (error) return res.status(400).send(error.details[0].message)

	const customer = await Customer.findById(req.body.customerId)
	if (!customer) return res.status(400).send('Invalid Customer.')
	const movie = await Movie.findById(req.body.movieId)
	if (!movie) return res.status(400).send('Invalid Movie.')

	const rental = await Rental.findByIdAndUpdate(
		req.params.id,
		{
			customer: {
				title: customer.name,
				isGold: customer.isGold,
				phone: customer.phone,
			},
			movie: {
				title: movie.title,
				dailyRentalRate: movie.dailyRentalRate,
			},
			dateOut: req.body.dateOut,
			dateReturned: req.body.dateReturned,
			rentalFee: req.body.rentalFee,
		},
		{ new: true }
	)

	if (!rental) return res.status(404).send('The rental with the given ID was not found.')

	res.send(rental)
})

router.get('/:id', async (req, res) => {
	const rental = await Rental.findById(req.params.id)

	if (!rental) return res.status(404).send('The rental with the given ID was not found.')

	res.send(rental)
})

module.exports = router
