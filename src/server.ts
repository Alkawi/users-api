import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

const users = ['Alex', 'Bailey', 'Fynn', 'Kiwi'];

app.post('/api/users', (request, response) => {
  users.push(request.body.name);
  response.send(`${request.body.name} is added`);
});

app.delete('/api/users/:name', (request, response) => {
  const name = request.params.name;
  const index = users.indexOf(name);
  if (index !== -1) {
    users.splice(index, 1);
    response.send(`${name} is deleted`);
  } else {
    response.status(404).send('Cannot delete! Name is unknown');
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
