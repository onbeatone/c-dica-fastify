import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import formbody from '@fastify/formbody';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';

import rootRoutes from './routes/root.js';
import usersRoutes from './routes/users.js';
import coursesRoutes from './routes/courses.js';

const app = fastify({
  exposeHeadRoutes: false,
});

const port = 3000;

// -----------------------------------------------------------------------------
// Plugins
// -----------------------------------------------------------------------------

await app.register(fastifyReverseRoutes);

const route = (name, params = {}) => (
  app.reverse(name, params)
);

await app.register(view, {
  engine: { pug },

  defaultContext: {
    route,
  },
});

await app.register(formbody);

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------

await app.register(rootRoutes);
await app.register(usersRoutes);
await app.register(coursesRoutes);

// -----------------------------------------------------------------------------
// Start server
// -----------------------------------------------------------------------------

app.listen({ port }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Example app listening on port ${port}`);
});