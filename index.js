const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')

const {User} = require('./models/User')
// JSON 데이터를 파싱하기 위해 express.json() 사용
// URL-encoded 데이터를 파싱하기 위해 express.urlencoded() 사용
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const config = require('./config/key');
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDb Connect...'))
  .catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) => {
  const user = new User(req.body);
  user.save()
    .then(userInfo => {
      console.log('userInfo',userInfo)
      return res.status(200).json({success:true})
    })
    .catch((err) => {
      return res.json({success:false, err});
    })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})