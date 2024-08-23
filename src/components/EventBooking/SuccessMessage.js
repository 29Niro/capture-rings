import React from "react";
export const SuccessMessage = ({ formData }) => {
  return (
    <>
      <div className="text-center">
        {/* Add a image */}
        <p className="text-lg text-gray-500 mb-4">Booking ID: {formData.id}</p>
        <h2 className="text-2xl font-bold mb-4">
          Your Appointment Booked successfully!
        </h2>
        <p className="text-lg text-gray-500">
          We have sent your booking information to your email address.
        </p>
        <div className="container font-serif mx-auto px-6 md:px-36 my-8 flex flex-col md:flex-row items-center justify-center text-center md:text-left text-gray-800 gap-4">
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <p>Service:</p>
            <p className="font-bold">{formData.title}</p>
          </div>
          <div className="border border-l-2 md:h-24"></div>
          <div className="border border-l-2 w-32 md:w-0 mb-4"></div>
          <div className="flex flex-col items-center mb-6 md:mb-0">
            <p>Date & Time</p>
            <p className="font-bold">
              {formData.date}, {formData.time}
            </p>
          </div>
          <div className="border border-l-2 md:h-24"></div>
          <div className="border border-l-2 w-32 md:w-0 mb-4"></div>
          <div className="flex flex-col items-center">
            <p>Customer Name</p>
            <p className="font-bold">
              {formData.fname} {formData.lname}
            </p>
          </div>
        </div>
      </div>

      <div className="border w-full my-4"></div>
      
    </>
  );
};
