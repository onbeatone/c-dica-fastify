import usersRepository from '../repositories/usersRepository.js';

export default async function sessionRoutes(app) {

  // Mostrar formulario login
  app.get('/session/new', {
    name: 'newSession',
  }, (req, res) => {

    // Si ya hay sesión activa, redirigir al home
    if (req.session.user) {
      return res.redirect(app.reverse('home'));
    }

    return res.view('src/views/session/new', {
      flash: res.flash(),
    });
  });

  // Procesar login
  app.post('/session', {
    name: 'createSession',
  }, (req, res) => {

    const { email, password } = req.body;

    // Buscar usuario por email
    const user = usersRepository
      .findAll()
      .find(
        (u) => u.email.toLowerCase() === email?.trim().toLowerCase(),
      );

    // Validar existencia y contraseña
    if (!user || user.password !== password) {
      req.flash('error', {
        type: 'danger',
        message: 'Credenciales incorrectas. Verifica tu email y contraseña.',
      });

      return res.redirect(app.reverse('newSession'));
    }

    // Guardar datos completos del usuario en sesión
    req.session.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    req.flash('success', {
      type: 'success',
      message: `¡Bienvenido, ${user.username}!`,
    });

    return res.redirect(app.reverse('home'));
  });

  // Logout
  app.post('/session/delete', {
    name: 'destroySession',
  }, (req, res) => {

    req.session.destroy();

    req.flash('info', {
      type: 'info',
      message: 'Sesión finalizada. ¡Hasta pronto!',
    });

    return res.redirect(app.reverse('home'));
  });
}