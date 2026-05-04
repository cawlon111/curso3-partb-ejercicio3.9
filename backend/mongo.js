const mongoose = require('mongoose')

// password desde línea de comandos
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb://cawlon:${password}@ac-wghbgrm-shard-00-00.9caici4.mongodb.net:27017,ac-wghbgrm-shard-00-01.9caici4.mongodb.net:27017,ac-wghbgrm-shard-00-02.9caici4.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-sm1n4b-shard-0&authSource=admin&appName=Cluster0`

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