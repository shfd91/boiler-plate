const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')


const { User } = require('./models/User')
const { auth } = require('./middleware/auth')
// JSON 데이터를 파싱하기 위해 express.json() 사용
// URL-encoded 데이터를 파싱하기 위해 express.urlencoded() 사용
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const config = require('./config/key');
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDb Connect...'))
  .catch(err => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);

  user.save()
    .then(userInfo => {
      console.log('userInfo', userInfo)
      return res.status(200).json({ success: true })
    })
    .catch((err) => {
      return res.json({ success: false, err });
    })
});

app.post('/api/users/login', (req, res) => {
  // req.body: request를 요청하면서 보낸 URL 데이터를 파싱한 결과를 가지고 있음
  console.log('req.body', req.body)
  User.findOne({ email: req.body.email })
    // findOne을 실행한 결과를 user로 사용할 수 있게 함(then은 처리 결과를 인자로 받는다.)
    .then((user) => {
      if (!user) {
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다."
        })
      }
      user.comparePassword(req.body.password, (err, isMatch) => {
        console.log('isMatch', isMatch)
        if (!isMatch) {
          return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
        }
        // 비밀번호 까지 맞다면 토큰을 생성하기.
        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err);
          res.cookie("x_auth", user.token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id })
        })
      })
    })
})

app.get('/api/users/auth', auth, (req, res) => {
  // 여기까지 왔다는 것은 Authentication이 true라는 말
  res.status(200).json({
    _id: req.user._id,
    // 0: 일반 유저
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
    .then(user => res.status(200).send({success: true}))
    .catch(err => res.json({success: false, err}))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})