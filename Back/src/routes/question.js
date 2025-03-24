const express = require('express')
const questionSchema = require('../models/questions')
const user = require('../models/user')
const jwt = require('jsonwebtoken')
const answerSchema = require('../models/answer')
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

//Obtener preguntas
router.get('/preguntas', async(req, res) => {
    try{
        const filter = req.query.tag ? { tags: req.query.tag } : {} //filtra por tag EJ: URL?tag=javascript
        const preguntas = await questionSchema.find(filter).populate('user', 'user').lean()

        // cuenta las respuesta de la pregunta
        const preguntaRespuestas = await Promise.all(
            preguntas.map(async (pregunta) => {
                const respuestaCount = await answerSchema.countDocuments({ question: pregunta._id })
                return { ...pregunta, respuestaCount }
            })
        )

        res.json(preguntaRespuestas)
    } catch(error){
        res.status(500).json({ error: 'Error al obtener las tareas' })
    }
})

//Obtener preguntas por usuario
router.get('/pregunta', tokenVerification, async(req, res) => {
    try{
        const preguntas = await questionSchema.find({ user: req.user.id })
        res.json(preguntas)
    } catch(error){
        res.status(500).json({ error: 'Error al obtener las tareas' })
    }
})

//Obtener pregunta
router.get('/pregunta/:id', async(req,res) => {
    try{
        const { id } = req.params
        const pregunta = await questionSchema.findById(id)
        res.json(pregunta)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la tarea'})
    }
})


//Obtener pregunta por usuario
router.get('/pregunta/:id', tokenVerification, async(req,res) => {
    try{
        const { id } = req.params
        const pregunta = await questionSchema.findById(id)
        res.json(pregunta)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la tarea'})
    }
})

//Obtener respuestas de la pregunta
router.get('/preguntaRespuesta/:questionId', async(req,res) => {
    try{
        const { questionId } = req.params
        
        const respuestas = await answerSchema.find({ question: questionId }).populate('user', 'user')

        res.status(200).json(respuestas)
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: 'Error al obtener las respuestas' })
    }
})

//Obtener respuestas de la pregunta por usuario
router.get('/preguntaRespuesta/:questionId', tokenVerification, async(req,res) => {
    try{
        const { questionId } = req.params
        
        const respuestas = await answerSchema.find({ question: questionId })

        res.status(200).json(respuestas)
    } catch(error) {
        console.log(error)
        res.status(500).json({ error: 'Error al obtener las respuestas' })
    }
})

//Agregar pregunta
router.post('/pregunta', tokenVerification, async(req, res) => {
    try{
        const { title, body, tags } = req.body
        const nuevaPregunta = new questionSchema ({
            title: title,
            body: body,
            tags: tags,
            user: req.user.id,
        })

        const preguntaGuardada = await nuevaPregunta.save()

        res.status(201).json(preguntaGuardada)
    } catch(error){
        res.status(500).json({ error: 'Error al crear la pregunta'})
    }
})

//Eliminar Pregunta
router.delete('/pregunta/:id', tokenVerification, async(req, res) => {
    try{
        const {id} = req.params
        const preguntaEliminada = await questionSchema.deleteOne({ _id: id })
        res.status(201).json(preguntaEliminada)
    }catch(error) {
        res.status(500).json({ error: 'Error al eliminar la pregunta '})
    }
})

// Actualizar Pregunta
router.put('/pregunta/:id', tokenVerification, async(req, res) => {
    try{
        const {id} = req.params
        const { title, body, tags } = req.body

        const preguntaActualizada = await questionSchema.updateOne(
            { _id: id },
            { 
                title: title,
                body: body,
                tags: tags
            }
        )
        res.status(200).json(preguntaActualizada)
    }catch(error) {
        res.status(500).json({error: 'Error al actualizar la pregunta'})
    }
})

// Aumentar voto
router.put('/preguntaVoteup/:id', tokenVerification, async(req, res) => {
    try{
        const {id} = req.params
        const votoActualizado = await questionSchema.updateOne(
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
router.put('/preguntaVotedown/:id', tokenVerification, async(req, res) => {
    try{
        const {id} = req.params
        const votoActualizado = await questionSchema.updateOne(
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

// Filtrar preguntas por Tags
router.get('/tags', async (req, res) => {
    try{
        const questions = await questionSchema.find({}, 'tags') // obtengo los tags
        const allTags = questions.flatMap(q => q.tags) // une los arrays
        const uniqueTags = [...new Set(allTags)]
        res.json(uniqueTags)
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los tags', error})
    }
})

module.exports = router