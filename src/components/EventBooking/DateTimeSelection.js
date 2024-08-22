import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export const DateTimeSelection = ({
  formData,
  setFormData,
  nextStep,
  prevStep,
}) => {
  const [date, setDate] = useState(
    formData.date ? new Date(formData.date) : new Date()
  );
  const [time, setTime] = useState(formData.time || '');

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleTimeChange = (newTime) => {
    setTime(newTime);
  };

  const handleNext = () => {
    setFormData({ ...formData, date: date.toISOString().split('T')[0], time });
    nextStep();
  };

  const timeSlots = [
    { id: 1, name: 'Afternoon', value: '3:00 pm - 6:00 pm' },
    { id: 2, name: 'Evening', value: '6:00 pm - 9:00 pm' },
    { id: 3, name: 'Night', value: '9:00 pm - 12:00 am' },
  ];

  return (
    <div className="m-6">
      <h2 className="text-2xl font-bold mb-4">Date & Time</h2>
      <div className="flex flex-col md:flex-row gap-10 items-start justify-center">
        <div className="md:w-1/2 w-full">
          <label className="block mb-2">Date</label>
          <div className="mb-4">
            <Calendar
              value={date}
              onChange={handleDateChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
              tileClassName="text-lg" // Increase tile size
            />
          </div>
        </div>
        <div className="md:w-1/2 w-full">
          <label className="block mb-2">Time Slot</label>
          <div className="grid grid-cols-1 gap-4">
            {timeSlots.map((slot) => (
              <div key={slot.id}>
                <label className="flex items-center">{slot.name}</label>
                <button
                  className={`p-4 border rounded-lg text-lg w-full ${
                    time === slot.value
                      ? 'bg-primaryBtn text-white'
                      : 'bg-white text-black'
                  }`}
                  onClick={() => handleTimeChange(slot.value)}
                >
                  {slot.value}
                </button>
              </div>
            ))}
          </div>
        </div>
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
          onClick={handleNext}
          className="bg-primaryBtn text-white px-4 py-2 rounded-lg"
        >
          Next: Basic Details
        </button>
      </div>
    </div>
  );
};
