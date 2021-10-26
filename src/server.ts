import express from 'express';

const app = express();
const port = 3000;

const users = ['Alex', 'Bailey', 'Fynn', 'Kiwi'];

app.delete('/api/users/:name', (request, response) => {
  const name = request.params.name;
  const isKnown = users.includes(name);
  if (isKnown) {
    users.splice(users.indexOf(name), 1);
    response.send(`${name} is deleted`);
  } else {
    response.status(404).send('Name is unknown');
  }
});

app.get('/api/users/:name', (request, response) => {
  const isNameKnow = users.includes(request.params.name);
  if (isNameKnow) {
    response.send(request.params.name);
  } else {
    response.status(404).send('Name is unknown');
  }
  // if name is unknown, return 404 with "Name is unknown"
});

app.get('/api/users', (_request, response) => {
  response.send(users);
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
