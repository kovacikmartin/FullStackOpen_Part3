require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log('connected to', url)

mongoose.connect(url)
  .then(() => {

    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error while connecting to db: ', error.message)
  })

const phonebookSchema = new mongoose.Schema({

  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: [true, 'Number is required'],
    validate: {

      validator: function(v){

        if(v.includes('-')){

          return /\d{2}-\d{5,}/.test(v) || /\d{3}-\d{4,}/.test(v)
        }

        // number without -
        return /\d{8,}/.test(v)
      },
      message: () => 'invalid phone number!'
    }
  }
})

phonebookSchema.set('toJSON', {

  transform: (document, returnedObject) => {

    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', phonebookSchema)