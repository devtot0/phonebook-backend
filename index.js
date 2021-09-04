const { response, request } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let persons = [
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

const RANDOM_ID_SEED = 143234452.783;

const generateId = (max) => {
  return Math.floor(Math.random() * max);
};

app.get("/", (request, response) => {
  response.send("<h1>Phonebook server</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const personToView = persons.find((person) => person.id === id);

  if (personToView) {
    const personInfo = `<h2>${personToView.name}</h2><h3>Phone number: ${personToView.number}</h3>`;
    response.send(personInfo);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.json(persons);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.number) {
    return response.status(404).json({ error: "number field cannot be empty" });
  } else if (persons.map((person) => person.name).includes(body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }
  const personObject = {
    id: generateId(RANDOM_ID_SEED),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(personObject);
  response.json(personObject);
});

app.get("/info", (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people
     <br> <br>${Date()}`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on the port ${PORT}`);
});
