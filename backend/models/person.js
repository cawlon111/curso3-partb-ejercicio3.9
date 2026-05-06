const mongoose = require('mongoose')

// Validador personalizado para el número de teléfono
const phoneNumberValidator = (number) => {
  // Formato: 2-3 dígitos + guión + al menos 6 dígitos (total mínimo 8 caracteres)
  const phoneRegex = /^\d{2,3}-\d{6,}$/
  return phoneRegex.test(number)
}

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, 'El nombre es obligatorio']
  },
  number: {
    type: String,
    required: [true, 'El número de teléfono es obligatorio'],
    validate: {
      validator: phoneNumberValidator,
      message: props => `${props.value} no es un número válido. Debe tener formato: XX-XXXXXXX o XXX-XXXXXXXX (mínimo 8 caracteres en total)`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)