const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const { User } = require("./models/user");

const config = require('./config/key');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
   useNewUrlParser: true, useUnifiedTopology: true
})
//MongoParseError: options usecreateindex, usefindandmodify are not supported
.then(()=>console.log('MongoDB Connected...'))
.catch(err => console.log(err));

app.get('/', (req, res)=>res.send('Hello World!'));

app.post('/register', async (req, res) => {
   // 회원가입시 필요한 정보들을 client에서 가져오면
   // 해당 정보를 데이터베이스에 넣어
   const user = new User(req.body);
   await user
   .save()
   .then(()=>{
      res.status(200).json({
         success: true
      });
   })
   .catch((err)=>{
      console.error(err);
      res.json({
         success:false,
         err: err
      })
   })
})

app.listen(port, ()=>console.log(`Example app listening on port ${port}!`));