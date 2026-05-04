const mongoose = require('mongoose')

// password desde línea de comandos
const password = process.argv[2]

// nombre y número (si existen)
const name = process.argv[3]
const number = process.argv[4]

// conexión a MongoDB Atlas
const url =
  `mongodb://cawlon:${password}@ac-wghbgrm-shard-00-00.9caici4.mongodb.net:27017,ac-wghbgrm-shard-00-01.9caici4.mongodb.net:27017,ac-wghbgrm-shard-00-02.9caici4.mongodb.net:27017/phonebook?ssl=true&replicaSet=atlas-sm1n4b-shard-0&authSource=admin&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// Schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// Model (colección: people)
const Person = mongoose.model('Person', personSchema)

// =========================
// SOLO LISTAR (1 argumento)
// =========================
if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')

    result.forEach(person => {
      console.log(person.name, person.number)
    })

    mongoose.connection.close()
  })
}

// =========================
// AGREGAR (3 argumentos)
// =========================
if (process.argv.length === 5) {
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}