require('dotenv').config()
const express = require("express")
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const Person = require('./modules/db')


const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))


morgan.token('content', (req)=>JSON.stringify(req.body))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"))

const errorHandler = (error, request, response, next) => {
    console.warn('error hadling middileware.')
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'malformatted id' })
    }
  
    next(error)
  }

const unknownEndpoint = (request, response) => {
    console.warn('unknown endpoint middleware.')
    response.status(404).json({ error: 'unknown endpoint.' })
}


app.get("/api/persons",(req,res, next)=>{
    Person
    .find({})
    .then(result => {
        // console.log(res);
        // console.log('phonebook:')
        // result.forEach(person => console.log(`${person.name} ${person.number}`))
        res.json(result)
        // mongoose.connection.close()
    })
    .catch(err => {
        next(err)
        // mongoose.connection.close()
    })
    
})


app.get("/info", (req, res, next)=>{
    Person
    .find({})
    .then(result => {
        // console.log(res);
        // console.log('phonebook:')
        // result.forEach(person => console.log(`${person.name} ${person.number}`))
        const info = `<p>Phonebook has info for ${result.length} people</p><p>${new Date}</p>`
        res.send(info)
        // mongoose.connection.close()
    })
    .catch(err => {
        next(err)
        // mongoose.connection.close()
    })
    
})


app.get("/api/persons/:id", (req, res, next)=>{
    // console.log(req.params.id)
    // console.log(typeof req.params.id)

    Person
    .findById(req.params.id)
    .then(result => {
        // console.log(res);
        // console.log('phonebook:')
        // result.forEach(person => console.log(`${person.name} ${person.number}`))
        if(result){
            res.json(result)
        }
        else{
            res.status(404).json({error: 'user not found.'})
        }
        // mongoose.connection.close()
    })
    .catch(err => {
        next(err)
        // mongoose.connection.close()
    })
    
})


app.delete("/api/persons/:id", (req,res, next)=>{
    Person
    .deleteOne({_id:req.params.id})
    .then(result => {
        console.log(result);
        // console.log('phonebook:')
        // result.forEach(person => console.log(`${person.name} ${person.number}`))
        if(result.deletedCount === 1){
            // console.log(result);
            res.status(204).end()
        }
        else{

            res.status(404)
            result.message = 'user was already deleted.'
            next(result)
        }
        // mongoose.connection.close()
    })
    .catch(err => {
        next(err)
        // mongoose.connection.close()
    })
     
})


// const randomNumber = () => {
//     const random = Math.floor(Math.random() * (100000000-1+1) + 1)
//     // console.log(random);
//     return random
// }


app.post("/api/persons",(req,res, next)=>{
    const body  = req.body
    // console.log(body);
    // console.log(body.name);
    // console.log(body.number);
    if(!body.name || !body.number){
        return res.status(400).json({error: 'Missing name/number'})
    }
    // if(notes.find(n=>n.name.toUpperCase() === body.name.trim().toUpperCase())){
    //     return res.status(400).json({error: `${body.name.trim()} already used in Phonebook.`})
    // }
    const person = new Person({
        name: body.name,
        number: body.number
    })
    person
    .save()
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => next(err))
    
})


app.get('/', (req,res, next)=>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})


app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
