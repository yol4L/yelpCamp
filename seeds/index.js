const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
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
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "648d333da94c9bbc9c90e11f",
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      price,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      images: [
        {
          url: "https://res.cloudinary.com/dlhcegyfb/image/upload/v1686999303/YelpCamp/chgebszhjm3aat1pkoh2.jpg",
          filename: "YelpCamp/chgebszhjm3aat1pkoh2",
        },
        {
          url: "https://res.cloudinary.com/dlhcegyfb/image/upload/v1686999305/YelpCamp/gugyttouvgg41jfeuhij.jpg",
          filename: "YelpCamp/gugyttouvgg41jfeuhij",
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
