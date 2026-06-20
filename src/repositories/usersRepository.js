export default {
users: [
{
id: 1,
username: 'admin',
email: 'admin@ocus.dev',
role: 'Administrator',
},
{
id: 2,
username: 'johndoe',
email: 'john@ocus.dev',
role: 'Student',
},
{
id: 3,
username: 'janedoe',
email: 'jane@ocus.dev',
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

nextId() {
return this.users.length + 1;
},

update(id, attrs) {
  const user = this.findById(id);

  if (!user) {
    return null;
  }

  Object.assign(user, attrs);

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
