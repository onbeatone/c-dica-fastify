import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import formbody from '@fastify/formbody';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';

import rootRoutes from './routes/root.js';
import usersRoutes from './routes/users.js';
import coursesRoutes from './routes/courses.js';
import morgan from 'morgan';
import middie from '@fastify/middie';
import cookie from '@fastify/cookie';
import session from '@fastify/session';
import sessionRoutes from './routes/session.js';
import flash from '@fastify/flash';

const app = fastify({
  exposeHeadRoutes: false,
});

const port = 3000;

// -----------------------------------------------------------------------------
// Plugins
// -----------------------------------------------------------------------------
await app.register(fastifyReverseRoutes);

await app.register(cookie);

await app.register(session, {
  secret: 'a secret with minimum length of 32 characters',
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  },
  saveUninitialized: false,
});

await app.register(flash);

// Inyectar currentUser en todas las vistas automáticamente
app.addHook('preHandler', (req, res, done) => {
  res.locals = res.locals ?? {};
  res.locals.currentUser = req.session.user ?? null;
  done();
});

const route = (name, params = {}) => app.reverse(name, params);

await app.register(view, {
  engine: { pug },
  defaultContext: {
    route,
  },
});

await app.register(formbody);
await app.register(middie);

const logger = morgan('combined');
app.use(logger);

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
await app.register(sessionRoutes);
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

  console.log(`Ocus Academy listening on port ${port}`);
});