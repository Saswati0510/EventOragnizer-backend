const coonectToMongo=require('./db');
const express = require('express')
const cors=require('cors')


const app = express()
app.use(cors())
const port = 5000
app.use(express.json())


coonectToMongo();
//ROUTES
app.use('/api/auth',require('./routes/auth'))
app.use('/api/events',require('./routes/events'))
app.use('/api/admin',require('./routes/admin'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})