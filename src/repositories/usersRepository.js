export default {
  users: [
    {
      id: 1,
      username: 'admin',
      email: 'admin@ocus.dev',
      password: 'admin123',
      role: 'Administrator',
    },
    {
      id: 2,
      username: 'johndoe',
      email: 'john@ocus.dev',
      password: 'john123',
      role: 'Student',
    },
    {
      id: 3,
      username: 'janedoe',
      email: 'jane@ocus.dev',
      password: 'jane123',
      role: 'Instructor',
    },
  ],

  findAll() {
    return this.users;
  },

  findById(id) {
    return this.users.find((user) => user.id === Number(id));
  },

  save(user) {
    this.users.push(user);
  },

  // Usa el max ID actual para evitar colisiones tras eliminaciones
  nextId() {
    if (this.users.length === 0) return 1;
    return Math.max(...this.users.map((u) => u.id)) + 1;
  },

  update(id, attrs) {
    const user = this.findById(id);

    if (!user) {
      return null;
    }

    // No permitir sobrescribir id, password o role desde aquí
    const { id: _id, password: _pw, role: _role, ...safeAttrs } = attrs;

    Object.assign(user, safeAttrs);

    return user;
  },

  remove(id) {
    const index = this.users.findIndex(
      (user) => user.id === Number(id),
    );

    if (index === -1) {
      return false;
    }

    this.users.splice(index, 1);

    return true;
  },
};