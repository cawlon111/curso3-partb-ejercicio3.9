import axios from 'axios'

const baseUrl = '/api/persons'

// 📥 Obtener todos
const getAll = () =>
  axios.get(baseUrl).then(res => res.data)

// ➕ Crear persona
const create = (newObject) =>
  axios.post(baseUrl, newObject).then(res => res.data)

// ❌ Eliminar persona
const remove = (id) =>
  axios.delete(`${baseUrl}/${id}`)

// ✏️ ACTUALIZAR persona (ESTO TE FALTABA)
const update = (id, newObject) =>
  axios.put(`${baseUrl}/${id}`, newObject).then(res => res.data)

// 📦 Exportación
export default {
  getAll,
  create,
  remove,
  update
}