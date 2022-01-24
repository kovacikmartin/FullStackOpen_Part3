const mongoose = require('mongoose')

if (process.argv.length < 3) {

    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

if (process.argv.length === 4 || process.argv.length > 5) {

    console.log('Please provide the arguments as such: node mongo.js <password> <name> <number>')
    process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@part3-mongodb-intro.qjfss.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const phonebookSchema = new mongoose.Schema({

    name: String,
    number: String,
})

const Person = mongoose.model('Person', phonebookSchema)

if (process.argv.length === 5) {

    const person = new Person({

        name: name,
        number: number,
    })
    
    person.save().then(result => {
    
        console.log(`added ${name} number ${number} to the phonebook`);
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    console.log('phonebook:')
    
    Person.find({}).then(result => {

        result.forEach(person => {
    
            console.log(`${person.name} ${person.number}`);
        })
    
        mongoose.connection.close()
    })
}