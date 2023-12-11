//this is just for validation before we submit something to the database.
const BaseJoi = require("joi");
const xss = require("xss");

const xssOptions = {
  whiteList: {
    a: ['href', 'title', 'target'], // Allowing certain tags and attributes
    p: [],
    div: []
  },
  stripIgnoreTag: true, // Remove all tags not in the whitelist
  stripIgnoreTagBody: ['script'] // Remove the content of script tags
};

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = xss(value, xssOptions);
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required().escapeHTML(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
