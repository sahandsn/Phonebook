const express = require("express")
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')


const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('build'))


morgan.token('content', (req)=>JSON.stringify(req.body))
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :content"))


let notes = [
    { 
      "id": 1,
      "name": "sahand", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get("/api/persons",(req,res)=>{
    res.json(notes)
})


app.get("/info", (req, res)=>{
    const info = `<p>Phonebook has info for ${notes.length} people</p><p>${new Date}</p>`
    res.send(info)
})


app.get("/api/persons/:id", (req, res)=>{
    const id = Number(req.params.id)
    const note = notes.find(n=>n.id===id)
    if(note){
        res.json(note)
    }
    else{
        res.status(404).send('Not Found!')
    }
})


app.delete("/api/persons/:id", (req,res)=>{
    const id = Number(req.params.id)
    notes = notes.filter(n=>n.id!==id)
    res.status(204).end() 
})


const randomNumber = () => {
    const random = Math.floor(Math.random() * (100000000-1+1) + 1)
    // console.log(random);
    return random
}


app.post("/api/persons",(req,res)=>{
    const body  = req.body
    // console.log(body);
    // console.log(body.name);
    // console.log(body.number);
    if(!body.name || !body.number){
        return res.status(400).json({error: 'Missing name/number'})
    }
    if(notes.find(n=>n.name.toUpperCase() === body.name.trim().toUpperCase())){
        return res.status(400).json({error: `${body.name.trim()} already used in Phonebook.`})
    }
    const note = {
        id : randomNumber(),
        name: body.name,
        number: body.number
    }
    notes = notes.concat(note)
    res.status(200).json(note)
})


app.get('/*', (req,res)=>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})


const PORT = 3001
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
