import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';

const app = fastify();
const port = 3000;

await app.register(view, { engine: { pug } } );

app.get('/', (req, res) => {
  res.view('src/views/index', { title: 'Home' });
});

app.get('/hello', (req, res) => {
  const { name = 'World' } = req.query;
  res.send(`Hello, ${name}!`);
});

app.get('/users/:id/post/:postId', (req, res) => {
  const { id, postId } = req.params;
  res.send(`User ID: ${id}, Post ID: ${postId}`);
});

const state = {
  courses: [
    {
      id: 1,
      titulo: 'JS: Arrays',
      descripcion: 'Curso sobre arrays en JavaScript',
    },
    {
      id: 2,
      titulo: 'JS: Funciones',
      descripcion: 'Curso sobre funciones en JavaScript',
    },
  ],
};

app.get('/courses/:id', (req, res) => {
  const { id } = req.params
  const course = state.courses.find(({ id: courseId }) => courseId === parseInt(id));
  if (!course) {
    res.code(404).send({ message: 'Course not found' });
    return;
  }
  const data = {
    course,
  };
  res.view('src/views/courses/show', data);
});

app.get('/courses', (req, res) => {
  const data = {
    courses: state.courses,
  };
  res.view('src/views/courses/index', data);
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});