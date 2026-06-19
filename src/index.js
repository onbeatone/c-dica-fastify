import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import sanitize from 'sanitize-html';
import formbody from '@fastify/formbody';
import usersRepository from './repositories/usersRepository.js';
import coursesRepository from './repositories/coursesRepository.js';


const app = fastify();
const port = 3000;


await app.register(view, { engine: { pug } });
await app.register(formbody);

app.get('/', (req, res) => {
  res.view('src/views/index', { title: 'Home' });
});

app.get('/hello', (req, res) => {
  const { name = 'World' } = req.query;
  res.send(`Hello, ${name}!`);
});

app.get('/users/:id', (req, res) => {
  const user = usersRepository.findById(req.params.id);

  if (!user) {
    return res.code(404).send({
      message: 'User not found',
    });
  }

  res.view('src/views/users/show', {
    user,
  });
});

app.get('/users/new', (req, res) => {
  res.view('src/views/users/new');
});

app.post('/users', (req, res) => {
  const user = {
    id: usersRepository.nextId(),

    username: req.body.name.trim(),

    email: req.body.email
      .trim()
      .toLowerCase(),

    password: req.body.password,

    role: 'Student',
  };

  usersRepository.save(user);

  res.redirect('/users');
});

app.get('/users/:id/post/:postId', (req, res) => {
  const { id, postId } = req.params;
  res.send(`User ID: ${id}, Post ID: ${postId}`);
});


app.get('/users', (req, res) => {
  res.view('src/views/users/index', {
    users: usersRepository.findAll(),
  });
});

app.get('/courses/:id', (req, res) => {
  const course = coursesRepository.findById(req.params.id);

  if (!course) {
    return res.code(404).send({
      message: 'Course not found',
    });
  }

  res.view('src/views/courses/show', {
    course,
  });
});

app.get('/courses', (req, res) => {
  const { term = '' } = req.query;

  const search = term.toLowerCase();

  const courses = coursesRepository
    .findAll()
    .filter((course) => (
      course.titulo.toLowerCase().includes(search)
      || course.descripcion.toLowerCase().includes(search)
    ));

  res.view('src/views/courses/index', {
    courses,
    term,
  });
});

app.get('/courses/new', (req, res) => {
  res.view('src/views/courses/new');
});

app.post('/courses', (req, res) => {
  const course = {
    id: coursesRepository.nextId(),

    titulo: req.body.titulo.trim(),

    descripcion: req.body.descripcion.trim(),
  };

  coursesRepository.save(course);

  res.redirect('/courses');
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});