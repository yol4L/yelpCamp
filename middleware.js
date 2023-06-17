const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpressError = require("./utilities/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};

module.exports.validateCampground = (req, res, next) => {
  // if (!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
  const { error } = campgroundSchema.validate(req.body);
  // console.log("validation error - campground", error);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  // console.log("validation error - review", error);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

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

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that.");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that.");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
