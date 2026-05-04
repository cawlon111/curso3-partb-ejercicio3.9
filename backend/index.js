const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const app = express()

app.use(express.static('dist'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Morgan token
morgan.token('body', (req) => JSON.stringify(req.body))

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// =======================
// MONGO DB CONNECTION
// =======================

const password = process.env.MONGO_PASSWORD

const url =
  `mongodb://cawlon:${password}@ac-wghbgrm-shard-00-00.9caici4.mongodb.net:27017,ac-wghbgrm-shard-00-01.9caici4.mongodb.net:27017,ac-wghbgrm-shard-00-02.9caici4.mongodb.net:27017/guiatelefonica?ssl=true&replicaSet=atlas-sm1n4b-shard-0&authSource=admin&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// Schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Model
const Person = mongoose.model('Person', personSchema)

// =======================
// ROUTES
// =======================

// GET all persons
app.get('/api/persons', (req, res) => {
  Person.find({}).then(result => {
    res.json(result)
  })
})

// GET info
app.get('/info', (req, res) => {
  Person.countDocuments({}).then(count => {
    const date = new Date()

    res.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${date}</p>
    `)
  })
})

// GET person by id
app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
})

// DELETE person
app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
})

// POST new person
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

// =======================
// UNKNOWN ENDPOINT
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