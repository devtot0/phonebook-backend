const { response } = require("express");
const express = require("express");

const app = express();

const persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Phonebook server</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const personToView = persons.find((person) => person.id === id);
  const personInfo = `<h2>${personToView.name}</h2><h3>Phone number: ${personToView.number}</h3>`;
  response.send(personInfo);
});

app.get("/info", (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people
     <br> <br>${Date()}`);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on the port ${PORT}`);
});
