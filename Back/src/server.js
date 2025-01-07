const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const usuarioSchema = require('./routes/user')
const cors = require('cors')

//
app.use(cors())

// Middlewares
app.use(express.json())

// Rutas
app.get('/', (req,res) => {
    res.send('Bienvenido a mi App')
})
app.use('/api', usuarioSchema)

// Conexion a mongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conexion exitosa a la base de datos'))
    .catch((error) => console.log(error))

// Port
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`El servidor ubicado en el puerto ${port}`)
})
