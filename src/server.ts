import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

const users = [
  {
    name: 'Manuel',
    username: 'manuel123',
    password: '123abc',
  },
  {
    name: 'Leon',
    username: 'lmachens',
    password: 'asdc',
  },
  {
    name: 'Anke',
    username: 'anke9000',
    password: 'ab',
  },
  {
    name: 'Philipp',
    username: 'phgrtz',
    password: 'pw123!',
  },
];

const model = {
  loggedInUser: {},
};
/* app.post('/api/login', (request, response) => {
  const credentials = request.body;
  const usernames = users.map((user) => user.username);
  const passwords = users.map((user) => user.password);
  
  if (usernames.includes(credentials.username)) {
    if (passwords.includes(credentials.password)) {
      response.send('Login successfully');
    } else {
      response.status(401).send('Wrong password');
    }
  } else {
    response.status(404).send('Wrong username');
  }
}); */

app.post('/api/login', (request, response) => {
  const credentials = request.body;
  const foundUser = users.find(
    (user) =>
      user.username === credentials.username &&
      user.password === credentials.password
  );

  if (foundUser) {
    model.loggedInUser = { name: foundUser.name, username: foundUser.username };
    response.send(`Hello ${foundUser.name}`);
  } else {
    response.status(401).send('Wrong username or password');
  }
});

app.post('/api/logout', (request, response) => {
  model.loggedInUser = request.body;
  response.send('Logout successful');
});

app.get('/api/me', (_request, response) => {
  response.send(model.loggedInUser);
});

app.post('/api/users', (request, response) => {
  const usernames = users.map((user) => user.username);
  const newUser = request.body;
  if (usernames.includes(newUser.username)) {
    response.status(409).send(`${newUser.username} already exists`);
  } else {
    users.push(newUser);
    response.send(`${newUser.username} is added`);
  }
});

app.delete('/api/users/:username', (request, response) => {
  const username = request.params.username;
  const index = users.map((user) => user.username).indexOf(username);
  if (index !== -1) {
    users.splice(index, 1);
    response.send(`${username} is deleted`);
  } else {
    response.status(404).send('Cannot delete! Name is unknown');
  }
});

app.get('/api/users/:username', (request, response) => {
  const user = users.find((user) => user.username === request.params.username);
  if (user) {
    response.send(user);
  } else {
    response.status(404).send('This page is not here. Check another Castle 🏰');
  }
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
