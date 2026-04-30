const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// Morgan token personalizado para mostrar body (3.8)
morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

// Morgan logger (3.7 + 3.8)
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// =======================
// DATA
// =======================

let persons = [
  { id: 1, name: "Arto Hellas", number: "040-123456" },
  { id: 2, name: "Ada Lovelace", number: "39-44-5323523" },
  { id: 3, name: "Dan Abramov", number: "12-43-234345" },
  { id: 4, name: "Mary Poppendieck", number: "39-23-6423122" }
]

// =======================
// ROUTES
// =======================

// raíz opcional
app.get('/', (req, res) => {
  res.send('Phonebook API 🚀')
})

// GET all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// GET info
app.get('/info', (req, res) => {
  const date = new Date()

  res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `)
})

// GET person by id
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

// DELETE person
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

// POST new person
app.post('/api/persons', (req, res) => {
  const body = req.body

  // validación básica
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number missing'
    })
  }

  // nombre único
  const nameExists = persons.some(p => p.name === body.name)

  if (nameExists) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  // crear nueva persona
  const newPerson = {
    id: Math.floor(Math.random() * 1000000),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)

  res.json(newPerson)
})

// =======================
// UNKNOWN ENDPOINT (3.9 ya preparado)
// =======================

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})