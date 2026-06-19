import fastify from 'fastify';

const app = fastify();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/hello', (req, res) => {
  const { name = 'World' } = req.query;
  res.send(`Hello, ${name}!`);
});

app.get('/users/:id/post/:postId', (req, res) => {
  const { id, postId } = req.params;
  res.send(`User ID: ${id}, Post ID: ${postId}`);
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});