const express = require('express')
const app = express()

const morgan = require('morgan')

morgan.token('body', function getPostBody (req) {

    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(express.static('build'))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
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

app.get('/api/persons', (request, response) => {

    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person){

        response.json(person)
    }
    else{

        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {

    const id = Number(request.params.id)
    
    if(persons.find(person => person.id === id)){
        persons = persons.filter(person => person.id !== id)
        response.status(204).end()
    }
    else{

        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {

    const body = request.body

    if(!body.name || !body.number){

        return response.status(400).json({error: 'name or number is missing'})
    }

    if(persons.find(person => person.name === body.name)){

        return response.status(409).json({error: 'name already exists'})
    }

    const idMin = Math.ceil(5)
    const idMax = Math.floor(10000)

    const randId = Math.floor(Math.random() * (idMax - idMin) + idMin)

    const person = request.body
    person.id = randId

    persons = persons.concat(person)

    response.json(person)
})

app.get('/info', (request, response) => {

    response.send(`Phonebook has info for ${persons.length} people.<br><br> ${new Date()}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
