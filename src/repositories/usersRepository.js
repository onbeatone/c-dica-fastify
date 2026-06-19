export default {
users: [
{
id: 1,
username: 'admin',
email: '[admin@ocus.dev](mailto:admin@ocus.dev)',
role: 'Administrator',
},
{
id: 2,
username: 'johndoe',
email: '[john@ocus.dev](mailto:john@ocus.dev)',
role: 'Student',
},
{
id: 3,
username: 'janedoe',
email: '[jane@ocus.dev](mailto:jane@ocus.dev)',
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
};
