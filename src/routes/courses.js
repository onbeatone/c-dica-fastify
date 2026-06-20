import sanitize from 'sanitize-html';

import coursesRepository from '../repositories/coursesRepository.js';

export default async function coursesRoutes(app) {

    app.get('/courses', {
        name: 'courses',
    }, (req, res) => {

        const {
            term = '',
        } = req.query;

        const search =
            term.toLowerCase();

        const courses =
            coursesRepository
                .findAll()
                .filter(
                    (course) => (
                        course.titulo
                            .toLowerCase()
                            .includes(search)
                        || course.descripcion
                            .toLowerCase()
                            .includes(search)
                    ),
                );

        res.view(
            'src/views/courses/index',
            {
                courses,
                term,
            },
        );
    });

    app.get('/courses/new', {
        name: 'newCourse',
    }, (req, res) => {
        res.view(
            'src/views/courses/new',
        );
    });

    app.get('/courses/:id', {
        name: 'course',
    }, (req, res) => {

        const course =
            coursesRepository.findById(
                req.params.id,
            );

        if (!course) {

            return res.code(404).send({
                message:
                    'Course not found',
            });

        }

        return res.view(
            'src/views/courses/show',
            {
                course,
            },
        );
    });

    app.post('/courses', {
        name: 'createCourse',
    }, (req, res) => {

        const course = {
            id: coursesRepository.nextId(),
            titulo: sanitize(
                req.body.titulo.trim(),
            ),
            descripcion: sanitize(
                req.body.descripcion.trim(),
            ),
        };

        coursesRepository.save(course);

        return res.redirect(
            app.reverse('courses'),
        );
    });

    app.get('/courses/:id/edit', {
        name: 'editCourse',
    }, (req, res) => {

        const course = coursesRepository.findById(
            req.params.id,
        );

        if (!course) {
            return res.code(404).send({
                message: 'Course not found',
            });
        }

        return res.view(
            'src/views/courses/edit',
            {
                course,
            },
        );
    });

    app.patch('/courses/:id', {
        name: 'updateCourse',
    }, (req, res) => {

        const course = coursesRepository.update(
            req.params.id,
            {
                titulo: sanitize(
                    req.body.titulo.trim(),
                ),
                descripcion: sanitize(
                    req.body.descripcion.trim(),
                ),
            },
        );

        if (!course) {
            return res.code(404).send({
                message: 'Course not found',
            });
        }

        return res.redirect(
            app.reverse('course', {
                id: req.params.id,
            }),
        );
    });

    app.delete('/courses/:id', {
        name: 'deleteCourse',
    }, (req, res) => {

        const deleted = coursesRepository.remove(
            req.params.id,
        );

        if (!deleted) {
            return res.code(404).send({
                message: 'Course not found',
            });
        }

        return res.redirect(
            app.reverse('courses'),
        );
    });

}