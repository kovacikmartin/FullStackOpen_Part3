require('dotenv').config()

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

const Person = require('./models/person')

const unknownEndpoint = (request, response) => {

    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {

    console.error(error.message)
  
    if (error.name === 'CastError') {

      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}

app.get('/api/persons', (request, response) => {

    Person.find({}).then(persons => {
    
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id)
        .then(person => {

            if(person){
                response.json(person)
            }
            else{
                response.status(404).end()
            }   
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    
    Person.findByIdAndRemove(request.params.id)
        .then(result => {

            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {

    const body = request.body

    if(!body.name || !body.number){

        return response.status(400).json({error: 'name or number is missing'})
    }

    const person = new Person({

        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {

        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {

    const body = request.body

    if(!body.name || !body.number){

        return response.status(400).json({error: 'name or number is missing'})
    }

    const person = {

        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {

            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {

    Person.find({}).then(persons => {

        response.send(`Phonebook has info about ${persons.length} persons.<br><br> ${new Date()}`)
    })
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})