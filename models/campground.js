const mongoose = require("mongoose");
const Review = require("./review");
const { Schema } = mongoose;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

// https://res.cloudinary.com/dlhcegyfb/image/upload/v1687002498/YelpCamp/ciynb2ax7iziu7bw1her.jpg

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_150");
});

const opts = { toJSON: { virtuals: true } };

const CampgroundSchema = new Schema(
  {
    title: String,
    images: [ImageSchema],
    geometry: {
      type: {
        type: String, //Don't do `{lcoation: {type: String}}`
        enum: ["Point"], //'location.type' must be 'Point'
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    price: Number,
    description: String,
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  opts
);

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  // console.log(doc);
  // console.log("deleted!!");
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `
  <strong><a href='/campgrounds/${this._id}'>${this.title}</a></strong>
  <p>${this.description.substring(0, 50)}...</p>`;
});

module.exports = mongoose.model("Campground", CampgroundSchema);
