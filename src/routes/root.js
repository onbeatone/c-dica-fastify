export default async function rootRoutes(app) {

  app.get('/', {
    name: 'home',
  }, (req, res) => {
    res.view('src/views/index', {
      title: 'Home',
    });
  });

  app.get('/hello', {
    name: 'hello',
  }, (req, res) => {
    const { name = 'World' } = req.query;

    res.send(`Hello, ${name}!`);
  });

}