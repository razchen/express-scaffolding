/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('home', {
    layout: 'default',
    template: 'home'
  });
};
