const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const DataModel = mongoose.model('Data', new mongoose.Schema({
  name: String,
  value: Number,
}))

app.post('/', async (req, res) => {
  const data = new DataModel(req.body)
  await data.save()
  res.status(201).send(data)
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

module.exports = app
