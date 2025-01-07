const express = require('express')
const usuarioSchema = require('../models/user')
const bcrypt = require('bcrypt')
const router = express.Router()


router.get('/usuarios', async(req, res) => {
    try {
        const usuarios = await usuarioSchema.find()
        res.json(usuarios)
    } catch(error){
        res.status(404).json({ error: 'Usuario no encontrado' })
    }
})

router.post('/registro', async(req, res) => {
    try{
        const { user, email, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const usuarioEmail = await usuarioSchema.findOne({ email })
        const usuarioName = await usuarioSchema.findOne({ user })
        if (usuarioEmail || usuarioName) return res.status(404)
            .json({ error: 'Usuario o Email ya registrado' })

        const nuevoUsuario = new usuarioSchema({
            user,
            email,
            password: hashedPassword
        })

        const usuarioGuardado = await nuevoUsuario.save()
        res.status(201).json(usuarioGuardado)
    } catch(error){
        res.status(500).json({ error: 'Error al registrar el usuario '})
    }
})


module.exports = router