import React, { useState } from 'react';
import { ServiceSelection } from '../components/EventBooking/ServiceSelection';
import { DateTimeSelection } from '../components/EventBooking/DateTimeSelection';
import { BasicDetails } from '../components/EventBooking/BasicDetails';
import { Summary } from '../components/EventBooking/Summary';
import { SuccessMessage } from '../components/EventBooking/SuccessMessage';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

export const EventBooking = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    price: '',
    date: '',
    time: '',
    fname: '',
    lname: '',
    email: '',
    phone: '',
    location: '',
  });

  const steps = [
    { label: 'Services', component: ServiceSelection },
    { label: 'Date & Time', component: DateTimeSelection },
    { label: 'Basic Details', component: BasicDetails },
    { label: 'Summary', component: Summary },
    { label: 'Success', component: SuccessMessage },
  ];

  const CurrentComponent = steps[currentStep].component;

  const nextStep = () => setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);

  return (
    <section>
      <Header />
      <div className="container mx-auto px-6 md:px-36 py-12">
        {/* Mobile View - Show only active step title */}
        <div className="md:hidden text-center text-lg font-semibold mb-6 py-2 px-4 mx-2 rounded-lg bg-primaryBtn text-white">
          {steps[currentStep].label}
        </div>

        {/* Desktop View - Show full step indicator */}
        <div className="hidden md:flex justify-start m-4 overflow-x-auto whitespace-nowrap">
          {steps.slice(0, -1).map((step, index) => (
            <div
              key={index}
              className={`text-center py-2 px-4 mx-2 rounded-lg flex-shrink-0 ${
                currentStep === index
                  ? 'bg-primaryBtn text-white'
                  : 'bg-gray-200 text-gray-500'
              } ${index < currentStep ? 'bg-blue-300' : ''}`}
              // Uncomment the next line to allow step navigation on click
              // onClick={() => setCurrentStep(index)}
            >
              {step.label}
            </div>
          ))}
        </div>
        <div className="container border rounded-md shadow-lg">
          <CurrentComponent
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        </div>
      </div>
      <Footer />
    </section>
  );
};
