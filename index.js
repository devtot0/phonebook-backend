require("dotenv").config();
const { response, request } = require("express");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/Person");

const app = express();

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(errorHandler);

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
  Person.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const personId = String(request.params.id);
  Person.findById(personId)
    .then((result) => {
      console.log(result);
      const personInfo = `<h2>${result.name}</h2><h3>Phone number: ${result.number}</h3>`;
      response.send(personInfo);
    })
    .then((error) => {
      response.status(404).end();
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  console.log(typeof request.params.id);
  const personId = String(request.params.id);
  Person.findByIdAndDelete(personId)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

app.put("/api/persons/:id", (request, response) => {
  const body = request.body;
  const personId = request.params.id;
  const updatedPerson = { ...body, number: body.number };
  Person.findByIdAndUpdate(personId, updatedPerson, { new: true })
    .then((result) => {
      response.json(updatedPerson);
    })
    .catch((error) => {
      next(error);
    });
  if (persons.map((person) => person.name).includes(body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.number) {
    return response.status(404).json({ error: "number field cannot be empty" });
  }
  const person = new Person({
    id: generateId(RANDOM_ID_SEED),
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.get("/info", (request, response) => {
  Person.find({}).then((result) => {
    console.log(result);
    response.send(`Phonebook has info for ${result.length} people
    <br> <br>${Date()}`);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on the port ${PORT}`);
});
