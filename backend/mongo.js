const mongoose = require('mongoose')

// password desde línea de comandos
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = process.env.MONGODB_URI
 

mongoose.set('strictQuery', false)

mongoose.connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message)
  })

// Schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// =========================
// LISTAR CONTACTOS
// =========================
if (!name && !number) {
  Person.find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(person => {
        console.log(person.name, person.number)
      })
    })
    .catch(err => {
      console.error(err)
    })
    .finally(() => {
      mongoose.connection.close()
    })
}

// =========================
// AÑADIR CONTACTO
// =========================
if (name && number) {
  const person = new Person({
    name,
    number,
  })

  person.save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`)
    })
    .catch(err => {
      console.error(err)
    })
    .finally(() => {
      mongoose.connection.close()
    })
}