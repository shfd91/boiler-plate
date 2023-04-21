const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const User = require('./models/User')

console.log(User.User);

mongoose.connect('mongodb+srv://sanghole:abcd1234@atlascluster.jnjbdoq.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('MongoDb Connect...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})