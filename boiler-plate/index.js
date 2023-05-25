const express = require('express');
const app = express();
const port = 3000;

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://joey1109:joey2335!!@boilerplate.1iqzsbn.mongodb.net/?retryWrites=true&w=majority', {
   useNewUrlParser: true, useUnifiedTopology: true
})
//MongoParseError: options usecreateindex, usefindandmodify are not supported
.then(()=>console.log('MongoDB Connected...'))
.catch(err => console.log(err));

app.get('/', (req, res)=>res.send('Hello World!'));

app.listen(port, ()=>console.log(`Example app listening on port ${port}!`));