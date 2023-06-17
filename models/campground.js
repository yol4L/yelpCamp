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

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
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
});

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

module.exports = mongoose.model("Campground", CampgroundSchema);
