const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Mongo connection open.");
  })
  .catch((err) => {
    console.log("Mongo connection error:", err);
  });

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const seedDB = async () => {
  await Campground.deleteMany({}); //Tips.
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      //this should be the personal user id. here is 'yola'.
      // author: "648ea9b3083c2ddc9a7ecf3d",
      author: "648ec0278c9eaddc9476a935",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      price,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dlhcegyfb/image/upload/v1687005056/YelpCamp/y8n8uymjaixafg8pk92p.jpg",
          filename: "YelpCamp/y8n8uymjaixafg8pk92p",
        },
        {
          url: "https://res.cloudinary.com/dlhcegyfb/image/upload/v1687002498/YelpCamp/ciynb2ax7iziu7bw1her.jpg",
          filename: "YelpCamp/ciynb2ax7iziu7bw1her",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
//Don't forget to execute it!
