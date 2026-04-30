import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService.getAll().then(data => setPersons(data))
  }, [])

  const showNotification = (message, isError = false) => {
    setNotification({ message, error: isError })

    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const nameTrimmed = newName.trim()

    const existingPerson = persons.find(
      p => p.name.toLowerCase() === nameTrimmed.toLowerCase()
    )

    // ✏️ ACTUALIZAR SI EXISTE
    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${existingPerson.name} ya existe. ¿Actualizar número?`
      )

      if (!confirmUpdate) return

      const updatedPerson = {
        ...existingPerson,
        number: newNumber
      }

      personService.update(existingPerson.id, updatedPerson)
        .then(returned => {
          setPersons(prev =>
            prev.map(p =>
              p.id !== existingPerson.id ? p : returned
            )
          )

          setNewName('')
          setNewNumber('')

          showNotification(`${returned.name} actualizado`)
        })

        // 🔥 AQUÍ ESTÁ LO DEL EJERCICIO 2.17
        .catch(() => {
          showNotification(
            `La persona '${existingPerson.name}' ya fue eliminada del servidor`,
            true
          )

          setPersons(prev =>
            prev.filter(p => p.id !== existingPerson.id)
          )
        })

      return
    }

    // ➕ CREAR NUEVO
    const personObject = {
      name: nameTrimmed,
      number: newNumber
    }

    personService.create(personObject)
      .then(returned => {
        setPersons(prev => prev.concat(returned))
        setNewName('')
        setNewNumber('')

        showNotification(`${returned.name} añadido`)
      })
      .catch(() => {
        showNotification('Error al añadir persona', true)
      })
  }

  const handleDelete = (id, name) => {
    if (!window.confirm(`¿Eliminar a ${name}?`)) return

    personService.remove(id)
      .then(() => {
        setPersons(prev => prev.filter(p => p.id !== id))
      })
      .catch(() => {
        showNotification(
          `El contacto ${name} ya no existe en el servidor`,
          true
        )

        setPersons(prev => prev.filter(p => p.id !== id))
      })
  }

  const personsToShow = persons
    .filter(p =>
      p.name.toLowerCase().includes(filter.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div>
      <h2>Buscar</h2>
      <input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />

      <h2>Añadir nuevo</h2>

      <Notification message={notification} />

      <form onSubmit={addPerson}>
        <div>
          Nombre:{' '}
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>

        <div>
          Número:{' '}
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>

        <button type="submit">añadir</button>
      </form>

      <h2>Números</h2>

      <ul>
        {personsToShow.map(person => (
          <li key={person.id}>
            {person.name} {person.number}
            <button onClick={() => handleDelete(person.id, person.name)}>
              eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App