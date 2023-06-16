module.exports.isLoggedIn = (req, res, next) => {
  //   console.log("Req.user...", req.user);
  if (!req.isAuthenticated()) {
    //store the url they are requesting and then return to it when logged in.
    //console.log(req.path, req.originalUrl);
    req.session.returnTo = req.originalUrl;
    req.flash("error", "you must be signed in first.");
    return res.redirect("/login");
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};
