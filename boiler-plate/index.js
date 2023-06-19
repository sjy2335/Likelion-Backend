const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const { User } = require("./models/user");
const { auth } = require('./middleware/auth')
const config = require('./config/key');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
   useNewUrlParser: true, useUnifiedTopology: true
})
   //MongoParseError: options usecreateindex, usefindandmodify are not supported
   .then(() => console.log('MongoDB Connected...'))
   .catch(err => console.log(err));

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/register', async (req, res) => {
   // 회원가입시 필요한 정보들을 client에서 가져오면
   // 해당 정보를 데이터베이스에 넣어
   const user = new User(req.body);
   await user
      .save()
      .then(() => {
         res.status(200).json({
            success: true
         });
      })
      .catch((err) => {
         console.error(err);
         res.json({
            success: false,
            err: err
         })
      })
})

app.post('/api/users/login', async (req, res) => {

   try {
      // 요청된 이메일 DB에 있는지 확인
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
         return res.json({
            loginSuccess: false,
            message: "제공된 이메일에 해당하는 유저가 없습니다."
         })
      }

      // 요청된 이메일 DB에 있다면 비밀번호 맞는지 확인
      const isMatch = await user.comparePassword(req.body.password)
      if (!isMatch)
         return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

      // 비밀번호까지 맞으면 토큰 생성
      const token = user.generateToken();
      // 쿠키에 토큰 저장
      res.cookie("x_auth", user.token)
         .status(200)
         .json({ loginSuccess: true, userId: user._id })
   } catch (err) {
      return res.status(400).json({ loginSuccess: false, error: err })
   }
})

app.get('/api/users/auth', auth, (req, res) => {
   // middleware 통과했으면 authentication은 true
   res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image,
   })
})

app.get('/users/logout', auth, async (req, res) => {
   try {
      await User.findOneAndUpdate({ _id: req.user._id }, { token: "" })
      return res.status(200).send({
         success: true
      })
   } catch (err) {
      return res.json({ success: false, err })
   }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));