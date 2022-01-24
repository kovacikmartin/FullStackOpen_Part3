require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connected to', url);

mongoose.connect(url)
    .then(result => {

        console.log('connected to MongoDB');
    })
    .catch((error) => {
        console.log('error while connecting to db: ', error.message);
    })

const phonebookSchema = new mongoose.Schema({

    name: String,
    number: String,
})

phonebookSchema.set('toJSON', {

    transform: (document, returnedObject) => {

        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', phonebookSchema)