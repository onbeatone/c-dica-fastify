import * as yup from 'yup';

import usersRepository from '../repositories/usersRepository.js';

export default async function usersRoutes(app) {

    app.get('/users', {
        name: 'users',
    }, (req, res) => {
        res.view('src/views/users/index', {
            users: usersRepository.findAll(),
        });
    });

    app.get('/users/new', {
        name: 'newUser',
    }, (req, res) => {
        res.view('src/views/users/new');
    });

    app.get('/users/:id', {
        name: 'user',
    }, (req, res) => {

        const user = usersRepository.findById(
            req.params.id,
        );

        if (!user) {
            return res.code(404).send({
                message: 'User not found',
            });
        }

        return res.view(
            'src/views/users/show',
            { user },
        );
    });

    app.get('/users/:id/edit', {
        name: 'editUser',
    }, (req, res) => {

        const user = usersRepository.findById(
            req.params.id,
        );

        if (!user) {
            return res.code(404).send({
                message: 'User not found',
            });
        }

        return res.view(
            'src/views/users/edit',
            {
                user,
            },
        );
    });

    app.get('/users/:id/post/:postId', {
        name: 'userPost',
    }, (req, res) => {

        const {
            id,
            postId,
        } = req.params;

        res.send(
            `User ID: ${id}, Post ID: ${postId}`,
        );
    });

    app.post('/users', {
        name: 'createUser',

        attachValidation: true,

        schema: {
            body: yup.object({
                name: yup
                    .string()
                    .trim()
                    .min(
                        2,
                        'El nombre debe tener al menos 2 caracteres',
                    )
                    .required(
                        'El nombre es obligatorio',
                    ),

                email: yup
                    .string()
                    .trim()
                    .lowercase()
                    .required(
                        'El email es obligatorio',
                    )
                    .matches(
                        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                        'Debe ingresar un correo válido',
                    ),

                password: yup
                    .string()
                    .min(
                        5,
                        'La contraseña debe tener al menos 5 caracteres',
                    )
                    .required(
                        'La contraseña es obligatoria',
                    ),

                passwordConfirmation: yup
                    .string()
                    .required(
                        'Debe confirmar la contraseña',
                    ),
            }),
        },

        validatorCompiler: ({ schema }) => (
            data,
        ) => {

            if (
                data.password
                !== data.passwordConfirmation
            ) {
                return {
                    error: new Error(
                        'La confirmación de contraseña no coincide',
                    ),
                };
            }

            try {

                const result =
                    schema.validateSync(data, {
                        abortEarly: false,
                    });

                return {
                    value: result,
                };

            } catch (error) {

                return {
                    error,
                };

            }
        },

    }, (req, res) => {

        const {
            name,
            email,
            password,
            passwordConfirmation,
        } = req.body;

        if (req.validationError) {

            return res.view(
                'src/views/users/new',
                {
                    name,
                    email,
                    password,
                    passwordConfirmation,
                    error: req.validationError,
                },
            );

        }

        const emailExists =
            usersRepository
                .findAll()
                .some(
                    (user) => (
                        user.email.toLowerCase()
                        === email.trim().toLowerCase()
                    ),
                );

        if (emailExists) {

            return res.view(
                'src/views/users/new',
                {
                    name,
                    email,
                    error: {
                        validation: [
                            {
                                message:
                                    'El correo ya se encuentra registrado',
                            },
                        ],
                    },
                },
            );

        }

        const user = {
            id: usersRepository.nextId(),
            username: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role: 'Student',
        };

        usersRepository.save(user);

        return res.redirect(
            app.reverse('users'),
        );
    });

    app.patch('/users/:id', {
        name: 'updateUser',
    }, (req, res) => {

        const user = usersRepository.update(
            req.params.id,
            {
                username: req.body.name?.trim(),
                email: req.body.email?.trim().toLowerCase(),
            },
        );

        if (!user) {
            return res.code(404).send({
                message: 'User not found',
            });
        }

        return res.redirect(
            app.reverse('user', {
                id: req.params.id,
            }),
        );
    });

    app.delete('/users/:id', {
        name: 'deleteUser',
    }, (req, res) => {

        const deleted = usersRepository.remove(
            req.params.id,
        );

        if (!deleted) {
            return res.code(404).send({
                message: 'User not found',
            });
        }

        return res.redirect(
            app.reverse('users'),
        );
    });
}