const routes = {
  // Home
  homePath: () => '/',
  helloPath: () => '/hello',

  // Users
  usersPath: () => '/users',
  newUserPath: () => '/users/new',
  userPath: (id) => `/users/${id}`,
  editUserPath: (id) => `/users/${id}/edit`,
  updateUserPath: (id) => `/users/${id}`,
  deleteUserPath: (id) => `/users/${id}`,
  userPostPath: (id, postId) => `/users/${id}/post/${postId}`,

  // Courses
  coursesPath: () => '/courses',
  newCoursePath: () => '/courses/new',
  coursePath: (id) => `/courses/${id}`,
  editCoursePath: (id) => `/courses/${id}/edit`,
  updateCoursePath: (id) => `/courses/${id}`,
  deleteCoursePath: (id) => `/courses/${id}`,
};

export default routes;