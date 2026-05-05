import axios from 'axios'

const baseUrl = '/api/persons'

// 📥 GET ALL
const getAll = () =>
  axios.get(baseUrl).then(res => res.data)

// ➕ CREATE
const create = (newObject) =>
  axios.post(baseUrl, newObject).then(res => res.data)

// ❌ DELETE
const remove = (id) =>
  axios.delete(`${baseUrl}/${id}`).then(res => res.data)

// ✏️ UPDATE
const update = (id, newObject) =>
  axios.put(`${baseUrl}/${id}`, newObject).then(res => res.data)

export default {
  getAll,
  create,
  remove,
  update
}