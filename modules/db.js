/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const url = process.env.MONGODB_URL;
console.log(`connecting to ${url}`);

// connect to db
mongoose
  .connect(url)
  .then(() => console.log('connected to MongoDB'))
  .catch((err) => console.log(`did not connect to MongoDB: ${err}`));

// configure the collection
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'name should be at least 3 charachters long, your\'s was {VALUE}'],
    required: true,
  },
  number: {
    type: String,
    validate: {
      minLength: 8,
      validator: (number) => /^(\d{2}-?\d{6,}|\d{3}-?\d{5,})$/.test(number),
      message: (props) => `${props.value} is not a valid phone number. Must be at least 8 digits, the first two or three digits can be seperated by hyphen.`,
      required: true,
    },
  },
});

personSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = doc._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

// present person, wrong number => BadId
// deleted person, right number => BadId
// deleted person, wrong number => ValidationError

// a deleted person will disappear from DOM when:
// a) reload
// b) updated with a correct nummber
// updating with a wrong number will not affect DOM

module.exports = mongoose.model('Person', personSchema);
