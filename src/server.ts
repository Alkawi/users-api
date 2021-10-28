import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cookieParser from 'cookie-parser';
import { connectDatabase, getUserCollection } from './utils/database';

if (!process.env.MONGODB_URI) {
  throw new Error('No MongoDB URL dotenv variable');
}

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

const users = [
  {
    _id: 0,
    name: 'Manuel',
    username: 'manuel123',
    password: '123abc',
  },
  {
    _id: 1,
    name: 'Leon',
    username: 'lmachens',
    password: 'asdc',
  },
  {
    _id: 2,
    name: 'Anke',
    username: 'anke9000',
    password: 'ab',
  },
  {
    _id: 3,
    name: 'Philipp',
    username: 'phgrtz',
    password: 'pw123!',
  },
];

app.post('/api/login', (request, response) => {
  const credentials = request.body;
  const foundUser = users.find(
    (user) =>
      user.username === credentials.username &&
      user.password === credentials.password
  );

  if (foundUser) {
    response.setHeader('Set-Cookie', `username=${foundUser.username}`);
    response.send(`Hello ${foundUser.name}`);
  } else {
    response.status(401).send('Wrong username or password');
  }
});

app.post('/api/logout', (_request, response) => {
  response.setHeader('Set-Cookie', `username=`);
  response.send('Logout successful');
});

app.get('/api/me', (request, response) => {
  const username = request.cookies.username;
  const foundUser = users.find((user) => user.username === username);

  if (foundUser) {
    response.send(request.cookies);
  } else {
    response.status(404).send('User not found');
  }
});
/*
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
*/

app.post('/api/users', async (request, response) => {
  const newUser = request.body;
  const existingUser = await getUserCollection().findOne({
    username: newUser.username,
  });

  if (existingUser) {
    response.status(409).send(`${newUser.username} already exists`);
  } else {
    const returnedObject = await getUserCollection().insertOne(newUser);
    response.send(
      `Supi, ${newUser.username} was added with id ${returnedObject.insertedId}!`
    );
  }
});

app.delete('/api/users/:username', async (request, response) => {
  const username = request.params.username;
  const document = await getUserCollection().findOne({ username });
  if (document !== null) {
    getUserCollection().deleteOne({ username });
    response.send(`${username} is deleted`);
  } else {
    response.status(404).send('Cannot delete! Name is unknown');
  }
});

app.get('/api/users/:username', async (request, response) => {
  const user = await getUserCollection().findOne({
    username: request.params.username,
  });
  if (user) {
    response.send(user);
  } else {
    response.status(404).send('This page is not here. Check another Castle 🏰');
  }
});

app.get('/api/users', async (_request, response) => {
  const userDocuments = await getUserCollection().find().toArray();
  response.send(userDocuments);
});

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

connectDatabase(process.env.MONGODB_URI).then(() => {
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
