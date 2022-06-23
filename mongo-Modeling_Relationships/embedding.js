const mongoose = require('mongoose')

mongoose
	.connect('mongodb://localhost/playground')
	.then(() => console.log('Connected to MongoDB...'))
	.catch((err) => console.error('Could not connect to MongoDB...', err))

const authorSchema = new mongoose.Schema({
	name: String,
	bio: String,
	website: String,
})

const Author = mongoose.model('Author', authorSchema)

const Course = mongoose.model(
	'Course',
	new mongoose.Schema({
		name: String,
		authors: [authorSchema],
	})
)

async function createCourse(name, authors) {
	const course = new Course({
		name,
		authors,
	})

	const result = await course.save()
	console.log(result)
}

async function listCourses() {
	const courses = await Course.find()
	console.log(courses)
}

async function updateAuthor(courseId) {
	const courses = await Course.update(
		{ _id: courseId },
		{
			$set: {
				'author.name': 'John Smith',
			},
		}
	)
}

async function updateAuthorUnset(courseId) {
	const courses = await Course.update(
		{ _id: courseId },
		{
			$unset: {
				author: '',
			},
		}
	)
}

async function addAuthor(courseId, author) {
	const course = await Course.findById(courseId)
	course.authors.push(author)
	course.save()
}

async function removeAuthor(courseId, authorId) {
	const course = await Course.findById(courseId)
	const author = course.authors.id(authorId)
	author.remove()
	course.save()
}

async function updateAuthorSub(courseId, authorId, updatedAuthor) {
	const course = await Course.findById(courseId)
	let author = course.authors.id(authorId)
	author.$set({ ...updatedAuthor })
	course.save()
}
// createCourse('Node Course', new Author({ name: 'Mosh' }))
// updateAuthorUnset('62b45d696532c24168cc8f4b')
// createCourse('Node', [new Author({ name: 'Mosh' }), new Author({ name: 'Amy' })])
// addAuthor('62b45d696532c24168cc8f4b', new Author({ name: 'Dave' }))
// removeAuthor('62b45d696532c24168cc8f4b', '62b45ea05860893578d1c1e6')
updateAuthorSub('62b45d696532c24168cc8f4b', '62b45d696532c24168cc8f49', { name: 'Yugi' })
