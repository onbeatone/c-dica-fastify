export default {
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

  findAll() {
    return this.courses;
  },

  findById(id) {
    return this.courses.find(
      (course) => course.id === Number(id),
    );
  },

  save(course) {
    this.courses.push(course);
  },

  nextId() {
    if (this.courses.length === 0) return 1;
    return Math.max(...this.courses.map((c) => c.id)) + 1;
  },

  update(id, attrs) {
    const course = this.findById(id);

    if (!course) {
      return null;
    }

    Object.assign(course, attrs);

    return course;
  },

  remove(id) {
    const index = this.courses.findIndex(
      (course) => course.id === Number(id),
    );

    if (index === -1) {
      return false;
    }

    this.courses.splice(index, 1);

    return true;
  },
};