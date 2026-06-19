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
return this.courses.length + 1;
},
};
