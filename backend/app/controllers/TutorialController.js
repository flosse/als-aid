/**
 * GET /tutorial
 * Tutorial page.
 */

exports.index = (req, res) => {
  res.render('tutorial', {
    title: 'Tutorial'
  });
};