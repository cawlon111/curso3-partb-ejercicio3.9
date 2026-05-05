require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
const url = process.env.MONGODB_URI

// =====================
// MIDDLEWARE
// =====================
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms :body'))

// =====================
// ROUTES
// =====================

// GET all
app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(result => res.json(result))
})

// GET one
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// INFO
app.get('/info', (req, res) => {
  Person.countDocuments({})
    .then(count => {
      const date = new Date()
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
      `)
    })
})

// POST (validación backend + Mongoose)
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save()
    .then(saved => res.json(saved))
    .catch(error => next(error))
})

// DELETE
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error))
})

// PUT (con validadores ACTIVADOS)
app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(
    req.params.id,
    person,
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )
    .then(updated => res.json(updated))
    .catch(error => next(error))
})

// =====================
// UNKNOWN ENDPOINT
// =====================
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// =====================
// ERROR HANDLER
// =====================
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

// =====================
// SERVER
// =====================
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})