require('dotenv').config()

const url = process.env.MONGODB_URI
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')  // ← AGREGADO: faltaba esta línea
const Person = require('./models/person')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3001
const app = express()

// conexión a MongoDB
mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log('Mongo error:', err))

// =====================
// MIDDLEWARE
// =====================
app.use(cors())  // ← AHORA FUNCIONA porque requerimos cors arriba
app.use(express.static('dist'))
app.use(express.json())

// Morgan para logging con body
morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :response-time ms :body'))

// =====================
// ROUTES
// =====================

// GET all
app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(result => res.json(result))
    .catch(error => next(error))
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
    .catch(error => next(error))
})

// POST (CREATE) - con validación mejorada
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

// PUT (UPDATE) - con validadores activados
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
    .then(updated => {
      if (updated) {
        res.json(updated)
      } else {
        res.status(404).end()
      }
    })
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
// ERROR HANDLER (MEJORADO)
// =====================
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  // Error de ID malformado
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'ID malformado' })
  }

  // Error de validación de Mongoose (MEJORADO para mensajes más claros)
  if (error.name === 'ValidationError') {
    // Mensajes personalizados según el campo
    if (error.errors?.name?.kind === 'minlength') {
      return res.status(400).json({ 
        error: 'El nombre debe tener al menos 3 caracteres' 
      })
    }
    if (error.errors?.name?.kind === 'required') {
      return res.status(400).json({ 
        error: 'El nombre es obligatorio' 
      })
    }
    if (error.errors?.number?.kind === 'required') {
      return res.status(400).json({ 
        error: 'El número de teléfono es obligatorio' 
      })
    }
    // Si hay otros errores de validación, mostrar el mensaje original
    return res.status(400).json({ error: error.message })
  }

  // Error por nombre duplicado (si agregas índice único después)
  if (error.name === 'MongoServerError' && error.code === 11000) {
    return res.status(400).json({ 
      error: 'Este nombre ya existe en la agenda' 
    })
  }

  next(error)
}

app.use(errorHandler)

// =====================
// SERVER
// =====================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})