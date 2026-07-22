const isSignedIn = (req, res, next) => {
  if (req.session.user) return next();
  req.session.returnTo = req.originalUrl;
  res.redirect("/auth/sign-in");
};

module.exports = isSignedIn;
