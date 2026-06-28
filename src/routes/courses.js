import sanitize from 'sanitize-html';

import coursesRepository from '../repositories/coursesRepository.js';

export default async function coursesRoutes(app) {

  app.get('/courses', {
    name: 'courses',
  }, (req, res) => {

    const { term = '' } = req.query;
    const search = term.toLowerCase();

    const courses = coursesRepository
      .findAll()
      .filter(
        (course) =>
          course.titulo.toLowerCase().includes(search) ||
          course.descripcion.toLowerCase().includes(search),
      );

    res.view('src/views/courses/index', {
      courses,
      term,
      flash: res.flash(),
    });
  });

  app.get('/courses/new', {
    name: 'newCourse',
  }, (req, res) => {

    if (!req.session.user) {
      req.flash('error', { type: 'danger', message: 'Debes iniciar sesión para acceder.' });
      return res.redirect(app.reverse('newSession'));
    }

    res.view('src/views/courses/new', {
      flash: res.flash(),
    });
  });

  app.get('/courses/:id', {
    name: 'course',
  }, (req, res) => {

    const course = coursesRepository.findById(req.params.id);

    if (!course) {
      return res.code(404).send({ message: 'Course not found' });
    }

    return res.view('src/views/courses/show', {
      course,
      flash: res.flash(),
    });
  });

  app.post('/courses', {
    name: 'createCourse',
  }, (req, res) => {

    if (!req.session.user) {
      return res.redirect(app.reverse('newSession'));
    }

    const titulo = sanitize(req.body.titulo?.trim() ?? '');
    const descripcion = sanitize(req.body.descripcion?.trim() ?? '');

    if (!titulo || !descripcion) {
      req.flash('error', { type: 'danger', message: 'Título y descripción son obligatorios.' });
      return res.redirect(app.reverse('newCourse'));
    }

    const course = {
      id: coursesRepository.nextId(),
      titulo,
      descripcion,
    };

    coursesRepository.save(course);

    req.flash('success', { type: 'success', message: 'Curso creado correctamente.' });

    return res.redirect(app.reverse('courses'));
  });

  app.get('/courses/:id/edit', {
    name: 'editCourse',
  }, (req, res) => {

    if (!req.session.user) {
      req.flash('error', { type: 'danger', message: 'Debes iniciar sesión para acceder.' });
      return res.redirect(app.reverse('newSession'));
    }

    const course = coursesRepository.findById(req.params.id);

    if (!course) {
      return res.code(404).send({ message: 'Course not found' });
    }

    return res.view('src/views/courses/edit', {
      course,
      flash: res.flash(),
    });
  });

  app.patch('/courses/:id', {
    name: 'updateCourse',
  }, (req, res) => {

    if (!req.session.user) {
      return res.redirect(app.reverse('newSession'));
    }

    const course = coursesRepository.update(req.params.id, {
      titulo: sanitize(req.body.titulo?.trim() ?? ''),
      descripcion: sanitize(req.body.descripcion?.trim() ?? ''),
    });

    if (!course) {
      return res.code(404).send({ message: 'Course not found' });
    }

    req.flash('success', { type: 'success', message: 'Curso actualizado correctamente.' });

    return res.redirect(app.reverse('course', { id: req.params.id }));
  });

  app.delete('/courses/:id', {
    name: 'deleteCourse',
  }, (req, res) => {

    if (!req.session.user) {
      return res.redirect(app.reverse('newSession'));
    }

    const deleted = coursesRepository.remove(req.params.id);

    if (!deleted) {
      return res.code(404).send({ message: 'Course not found' });
    }

    req.flash('success', { type: 'success', message: 'Curso eliminado correctamente.' });

    return res.redirect(app.reverse('courses'));
  });
}