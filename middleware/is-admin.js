const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) return next();
    res.redirect("/");
};

module.exports = isAdmin;
