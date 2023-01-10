import mongoose from 'mongoose';
import Campground from '../models/campground.js';
import cities from './cities.js';
import { places, descriptors } from './seedHelpers.js';
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Database connected");
});


const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '63ac22f41cea83494a2a5d3f',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt veritatis earum velit facilis. At veritatis beatae perspiciatis optio ullam nostrum voluptatem voluptate itaque ipsa, doloremque facere animi, recusandae officiis esse!",
            price,
            geometry: { type: 'Point', coordinates: [cities[random1000].longitude, cities[random1000].latitude] },
            images: [
                {
                    url: 'https://res.cloudinary.com/dnofzucxg/image/upload/v1672569929/Yelpcamp/qvhwfm9wqbpj6fi3exho.jpg',
                    filename: 'Yelpcamp/qvhwfm9wqbpj6fi3exho',
                },
                {
                    url: 'https://res.cloudinary.com/dnofzucxg/image/upload/v1672569942/Yelpcamp/card4u5rzpdbtvop8xnf.jpg',
                    filename: 'Yelpcamp/card4u5rzpdbtvop8xnf',
                }
            ]

        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});