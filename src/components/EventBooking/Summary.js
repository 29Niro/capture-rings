import React from 'react';
import emailjs from 'emailjs-com';
import { db } from '../../firebase/firebase-config';
import { doc, setDoc } from 'firebase/firestore';
import { generateBookingId } from '../../utils/utils';

export const Summary = ({ formData, setFormData, nextStep, prevStep }) => {

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const bookingId = generateBookingId();
      const docRef = doc(db, 'appointments', bookingId);

      // Update the form data with the booking ID
      setFormData({ ...formData, id: bookingId });

      // Save appointment to Firestore
      await setDoc(docRef, {
        ...formData,
        id: bookingId,
        createdAt: new Date(),
        status: 'pending',
      });

      // Email template parameters
      const templateParams = {
        to_name: `${formData.fname} ${formData.lname}`,
        to_email: formData.email,
        to_shop: 'niroorin2@gmail.com',
        from_name: 'Capture Rings Studio', // or any name you prefer
        service: formData.title,
        date: formData.date,
        time: formData.time,
        price: formData.price,
        message: `Your booking with ID ${bookingId} has been confirmed.`,
      };

      // Send email to the user
      await emailjs.send(
        'service_vk35obn',
        'template_3ccaq4p',
        templateParams,
        'heknMVjMXv40gqWVt'
      );

      //add another template for the shop owner

      nextStep();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <div className="m-6 text-center">
      <h2 className="text-2xl font-bold mb-2">Summary</h2>
      <p className="text-lg mb-4 text-gray-500">
        Your appointment booking summary
      </p>

      <p className="mb-2">Customer</p>
      <p className="mb-4">
        <strong>
          {formData.fname} {formData.lname}
        </strong>
      </p>

      <div className="flex items-center justify-center gap-4 text-left">
        <div>
          <p className="mb-2">Service</p>
          <p className="mb-2">
            <strong>{formData.title}</strong>
          </p>
        </div>
        <div className="border-2 h-16 my-4"></div>
        <div>
          <p className="mb-2">Date & Time</p>
          <p className="mb-2">
            <strong>{formData.date}</strong>, <strong>{formData.time}</strong>
          </p>
        </div>
      </div>
      <div className="border w-full my-4"></div>

      <div className="py-2 px-10 flex justify-between">
        <strong>Total Price</strong>
        <strong>
          <p>Rs {formData.price}.00</p>
        </strong>
      </div>
      <div className="border w-full my-4"></div>
      <div className="flex justify-end gap-4">
        <button
          onClick={prevStep}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          className="bg-primaryBtn text-white px-4 py-2 rounded-lg"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};
