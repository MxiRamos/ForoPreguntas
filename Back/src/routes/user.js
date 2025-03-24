const express = require('express')
const usuarioSchema = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()

//Middleware para verificar token
const tokenVerification = (req, res, next) => {
    const token = req.header('Authorization')

    if(!token) return res.status(401).json({ error: 'Acceso denegado' })

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified
        next()
    } catch (error) {
        res.status(400).json({ error: 'Token no valido' })
    }
}

//Obtener usuarios
router.get('/usuarios', async(req, res) => {
    try {
        const usuarios = await usuarioSchema.find()
        res.json(usuarios)
    } catch(error){
        res.status(404).json({ error: 'Usuario no encontrado' })
    }
})

//Obtener usuario
router.get('/usuario/:id', async(req, res) => {
    try{
        const { id } = req.params
        const usuario = await usuarioSchema.findById(id)
        res.json(usuario)
    } catch(error){
        res.json({ error: 'Usuario no encontrado'})
    }
})

//Obtener el Usuario mediante el token
router.get('/usuario', tokenVerification, async(req, res) => {
    try {
        const usuarioId = req.user.id

        const usuario = await usuarioSchema.findById(usuarioId).select('-password')

        if(!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' })
        }

        res.json(usuario)
    } catch(error){
        res.status(500).json({ error: 'Error al obtener los datos del usuario' })
    }
})

//Registrar un usuario
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

//Eliminar usuario
router.delete('/usuario/:id', tokenVerification, async(req, res) => {
    try {
        const { id } = req.params
        const usuarioEliminado = await usuarioSchema.deleteOne({ _id: id })
        res.status(201).json(usuarioEliminado)
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario' })
    }
})

//Actualizar usuario
router.put('/usuario/:id', tokenVerification, async(req,res) => {
    try {
        const { id } = req.params
        const { user, email, password, confirmPassword } = req.body

        if(password !== confirmPassword){
            return res.status(400).json({ error: 'La confirmacion no coinciden' })
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined

        const updateData = {
            user,
            email,
            ...(hashedPassword && {password: hashedPassword})
        }

        const usuarioActualizado = await usuarioSchema.updateOne(
            { _id: id },
            { $set: updateData }
        )
        res.status(200).json(usuarioActualizado)
    } catch(error) {
        res.status(500).json({ error: 'Error al actualizar el usuario' })
    }
})

//Iniciar sesion
router.post('/login', async(req,res) => {
    try {
        const { user, password } = req.body
        const usuarioCuenta = await usuarioSchema.findOne({ user })
        if(!usuarioCuenta) return res.status(404).json({ error: 'Usuario no encontrado'})

        const esValido = await bcrypt.compare(password, usuarioCuenta.password)
        if(!esValido) return res.status(401).json({ error: 'Contraseña incorrecta' })

        const token = jwt.sign({ id: usuarioCuenta._id }, process.env.JWT_SECRET, {expiresIn: '1h'})
        res.json({ token })
    } catch(error){
        res.status(500).json({ message: 'Error al iniciar sesion', error: error })
    }
})

module.exports = router