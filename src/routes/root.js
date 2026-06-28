export default async function rootRoutes(app) {

  app.get('/', {
    name: 'home',
  }, (req, res) => {

    const visited = req.cookies.visited === 'true';

    res.cookie('visited', 'true');

    res.view('src/views/index', {
      title: 'Home',
      user: req.session.user,
      visited,
      flash: res.flash(),
    });
  });

  app.get('/hello', {
    name: 'hello',
  }, (req, res) => {

    const { name = 'World' } = req.query;

    res.send(`Hello, ${name}!`);
  });
}