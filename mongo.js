const mongoose = require("mongoose");
require("dotenv").config();

const password = process.argv[2];

const url = process.env.MONGO_URI;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

mongoose.connect(url);
if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js password"
  );
  mongoose.connection.close();
} else if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    persons.forEach((person) => console.log(person));
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`added ${person.name} ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}
