const mongoose = require("mongoose")

mongoose.set("strictQuery", false)
const url = process.env.MONGODB_URL
console.log(`connecting to ${url}`);

// connect to db
mongoose
.connect(url)
.then(res=>console.log(`connected to MongoDB`))
.catch(err=>console.log(`did not connect to MongoDB: ${err}`))

// configure the collection
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, `name should be at least 3 charachters long, your's was {VALUE}`]
    },
    number: Number,
})
personSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = doc._id.toString()
        delete ret._id
        delete ret.__v
    }
})

module.exports = mongoose.model('Person', personSchema)