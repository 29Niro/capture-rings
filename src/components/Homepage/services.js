import React from "react";
import { Link } from "react-router-dom";
import birthdayShoot from "../../assets/birthday-shoot.png";
import graduationShoot from "../../assets/graduation-shoot.png";
import weddingShoot from "../../assets/wedding-shoot.png";

const services = [
  {
    title: "Wedding Shoots",
    image: weddingShoot,
    description:
      "Capture Rings where your precious moments are immortalized through the lens of our skilled photographers.",
  },
  {
    title: "Graduation Shoots",
    image: graduationShoot,
    description:
      "With an unwavering commitment to excellence, we specialize in wedding photography that captures the essence of your love story.",
  },
  {
    title: "Birthday Shoots",
    image: birthdayShoot,
    description:
      "Our skilled photographers make every occasion special with their artistic and creative photography skills.",
  },
];

export const Services = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-6 md:px-36 text-center">
        <h2 className="text-lg text-gray-500 uppercase mb-2">
          Top Service From Us
        </h2>
        <h1 className="text-5xl font-serif font-bold mb-6 text-pink-500">
          Our Services
        </h1>
        <p className="text-lg mb-12">
          Welcome to Capture Rings where your precious moments are immortalized
          through the lens of our skilled photographers. With an unwavering
          commitment to excellence, we specialize in wedding photography that
          captures the essence of your love story.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-96 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                {/* <p className="text-gray-700">{service.description}</p> */}
              </div>
            </div>
          ))}
        </div>
        <Link
          to="/booking"
          className="bg-primaryBtn text-white font-serif px-6 py-3 rounded-3xl text-lg"
        >
          Book Now
        </Link>
      </div>
    </section>
  );
};
