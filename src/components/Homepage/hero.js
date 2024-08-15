/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import heroImg from '../../assets/heroImg.png';
import heroBg from '../../assets/heroBg.png';
import srilanka from '../../assets/srilanka.png';
import customerService from '../../assets/customer-service.png';
import support from '../../assets/support.png';

export const Hero = () => {
  return (
    <section >
      <div
        className="container mx-auto px-6 md:px-36 flex flex-col md:flex-row items-center justify-between bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
          width: '100%',
          height: 'auto',
        }}
      >
        <div className="text-center md:text-left md:w-1/2">
          <h1 className="font-bold text-primaryBtn py-2">Capture Rings</h1>
          <h1 className="text-7xl font-serif text-gray-800">
            Capture Your Moments With Us
          </h1>
          <div className="mt-6 flex justify-center md:justify-start">
            <button
              href="#"
              className="bg-primaryBtn text-white font-serif px-6 py-3 rounded-3xl text-lg mr-4"
            >
              Book Now
            </button>
            <button
              href="#"
              className="bg-pink-600 text-white font-serif px-6 py-3 rounded-3xl text-lg"
            >
              Our Gallery
            </button>
          </div>
        </div>
        <div className="mt-8 py-6 md:mt-0 md:w-1/2 flex justify-center">
          <img
            src={heroImg}
            alt="Wedding rings"
            className="rounded-full shadow-lg"
          />
        </div>
      </div>
      <div className="container font-serif mx-auto px-6 md:px-36 my-8 flex flex-col md:flex-row items-center justify-around text-center md:text-left text-gray-800">
        <div className="flex flex-col items-center mb-6 md:mb-0">
          <img src={srilanka} className="h-12 w-12 mb-4" alt="like" />
          <p>Islandwide Service</p>
        </div>
        <div className="border border-l-2 md:h-24"></div>
        <div className="border border-l-2 w-32 md:w-0 mb-4"></div>
        <div className="flex flex-col items-center mb-6 md:mb-0">
          <img src={customerService} className="h-12 w-12 mb-4" alt="like" />
          <p>Excellent Standards</p>
        </div>
        <div className="border border-l-2 md:h-24"></div>
        <div className="border border-l-2 w-32 md:w-0 mb-4"></div>
        <div className="flex flex-col items-center">
          <img src={support} className="h-12 w-12 mb-4" alt="like" />
          <p>24/7 Service</p>
        </div>
      </div>
    </section>
  );
};
