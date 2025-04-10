const express = require('express')
const answerSchema = require('../models/answer')
const userSchema = require('../models/user')
const questionSchema = require('../models/questions')
const jwt = require('jsonwebtoken')
const router = express.Router()

// Middleware para verificar token
const tokenVerification = (req, res, next) => {
    const token = req.header('Authorization')

    // si token no esta autorizado muestra el error
    if(!token) return res.status(401).json({ error: 'Acceso denegado' }) 

    // verificacion del token
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verified 
        next()
    } catch (error) {
        res.status(400).json({ error: 'Token no valido' })
    }
}

//Obtener respuestas
router.get('/respuesta', async(req, res) => {
    try {
        const respuesta = await answerSchema.find().populate('user', 'user')
        res.json(respuesta)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las respuestas' })
    }
})

//Obtener respuestas por usuario
router.get('/respuesta', tokenVerification, async(req, res) => {
    try {
        const respuesta = await answerSchema.find({ user: req.user.id })
        res.json(respuesta)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las respuestas' })
    }
})

/*
//Obtener respuesta
router.get('/respuesta/:id', tokenVerification, async(req, res) => {
    try{
        const { id } = req.params
        const respuesta = await answerSchema.findById(id)
        res.json(respuesta)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la respuesta'})
    }
})
*/

//Obtener respuesta sin token
router.get('/respuesta/:id', async(req, res) => {
    try{
        const { id } = req.params
        const respuesta = await answerSchema.findById(id)
        res.json(respuesta)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la respuesta'})
    }
})

//Agregar respuesta
router.post('/respuesta', tokenVerification, async(req, res) => {
    try{
        const { body, question } = req.body
        const nuevaRespuesta = new answerSchema ({
            body: body,
            user: req.user.id,
            question: question
        })

        const respuestaGuardada = await nuevaRespuesta.save()

        res.status(201).json(respuestaGuardada)
    } catch(error){
        console.log(error)
        res.status(500).json({ error: 'Error al crear la respuesta'})
    }
})

//Eliminar Respuesta
router.delete('/respuesta/:id', tokenVerification, async(req, res) => {
    try{
        const {id} = req.params
        const respuestaEliminada = await answerSchema.deleteOne({ _id: id })
        res.status(201).json(respuestaEliminada)
    }catch(error) {
        res.status(500).json({ error: 'Error al eliminar la respuesta '})
    }
})

// Actualizar Respuesta sin token
router.put('/respuesta/:id', tokenVerification, async(req, res) => {
    try{
        const { id } = req.params
        const { body } = req.body

        const respuestaActualizada = await answerSchema.updateOne(
            { _id: id },
            { body: body }
        )
        res.status(200).json(respuestaActualizada)
    }catch(error) {
        res.status(500).json({error: 'Error al actualizar la respuesta'})
    }
})

/*
// Actualizar Respuesta
router.put('/respuesta/:id', tokenVerification, async(req, res) => {
    try{
        const { id } = req.params
        const { body } = req.body

        const respuestaActualizada = await answerSchema.updateOne(
            { _id: id },
            { body: body }
        )
        res.status(200).json(respuestaActualizada)
    }catch(error) {
        res.status(500).json({error: 'Error al actualizar la respuesta'})
    }
})
*/

// Aumentar voto
router.put('/respuestaVoteup/:id', tokenVerification, async(req, res) => {
    try{
        const {id} = req.params
        const votoActualizado = await answerSchema.updateOne(
            { _id: id },
            {
                $inc: { votes:1 }
            }
        )

        res.status(200).json({ message: 'Voto incrementado'})
    } catch(error) {
        console.log('Error al incrementar el voto: ', error)
        res.status(500).json({ message: 'Error interno del servidor'})
    }
})

// Disminuir voto
router.put('/respuestaVotedown/:id', tokenVerification, async(req, res) => {
    try{
        const {id} = req.params
        const votoActualizado = await answerSchema.updateOne(
            { _id: id },
            {
                $inc: { votes: -1 }
            }
        )

        res.status(200).json({ message: 'Voto incrementado'})
    } catch(error) {
        console.log('Error al incrementar el voto: ', error)
        res.status(500).json({ message: 'Error interno del servidor'})
    }
})

module.exports = router