/**
 * GET /legal
 * Legal page.
 */

exports.index = (req, res) => {
  res.render('legal', {
    title: 'Legal'
  });
};