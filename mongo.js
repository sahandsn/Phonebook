// const mongoose = require("mongoose")

// check the coomand line : node mongo.js password name number
// if name contains space, enclose in quotation marks
// if (process.argv.length !== 3 && process.argv.length !== 5){
//     console.log(process.argv.length);
//     console.log("wrong input")
//     process.exit(1)
// }

// const password = encodeURIComponent(process.argv[2])
// const url = `mongodb+srv://fullstackopen:${password}@cluster0.ksab25e.mongodb.net/Phonebook?retryWrites=true&w=majority`

// mongoose.set("strictQuery", false)
// mongoose.connect(url)

// configure the collection
// const personSchema = new mongoose.Schema({
//     name: String,
//     number: Number,
// })
// const Person = mongoose.model('Person', personSchema)

// query all people
// if(process.argv.length === 3){
//     Person
//     .find({})
//     .then(res => {
//         console.log(res);
//         // console.log('phonebook:')
//         // res.forEach(person => console.log(`${person.name} ${person.number}`))
//         mongoose.connection.close()
//     })
//     .catch(err => {
//         console.warn(err)
//         mongoose.connection.close()
//     })
// }

// add a new person
if(process.argv.length === 5){
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number,
    })
    person
    .save()
    .then(res => {
        // console.log(res);
        console.log(`added ${name} number ${number} to phonebook`);
        mongoose.connection.close()
    })
    .catch(err => {
        console.warn(err)
        mongoose.connection.close()
    })
}