import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import emailjs from 'emailjs-com';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { db } from '../../firebase/firebase-config';
import { generateOrderId } from '../../utils/utils';
import { Footer } from '../footer';
import { Header } from '../header';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

// Validation schema
const schema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  postalCode: yup.string().required('Postal code is required'),
  country: yup.string().required('Country is required'),
  paymentMethod: yup.string().required('Payment method is required'),
  cardNumber: yup.string().required('Card number is required'),
  expiryDate: yup.string().required('Expiry date is required'),
  cvv: yup.string().required('CVV is required'),
  shippingMethod: yup.string().required('Shipping method is required'),
});

export const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const { cart, calculateTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state
  const [showSnackbar, setShowSnackbar] = useState(false); // Snackbar state
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const total = calculateTotal();
  const watchPaymentMethod = watch('paymentMethod', 'credit');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const orderId = generateOrderId();
      const orderData = {
        ...data,
        id: orderId,
        items: cart,
        total: total,
        createdAt: new Date(),
        status: 'pending',
      };

      // Save order to Firestore
      const docRef = doc(db, 'orders', orderId);
      await setDoc(docRef, orderData);

      // Prepare email template parameters
      const templateParams = {
        to_name: data.fullName,
        to_email: data.email,
        to_shop: 'niroorin2@gmail.com', // Shop owner's email
        from_name: 'Capture Shop',
        order_id: orderId,
        order_details: cart
          .map((item) => `${item.name} (${item.quantity})`)
          .join(', '),
        total_amount: total,
        shipping_address: `${data.address}, ${data.city}, ${data.postalCode}, ${data.country}`,
      };

      // Send email to the customer
      await emailjs.send(
        'service_vk35obn', // Replace with your EmailJS service ID
        'template_xvpq1f5', // Replace with your EmailJS template ID for customer emails
        templateParams,
        'heknMVjMXv40gqWVt' // Replace with your EmailJS user ID
      );

      // Clear the cart after successful order
      clearCart();
      setTimeout(() => {
        setLoading(false);
        setShowSnackbar(true);
        navigate('/shop'); // Redirect to shop page
      }, 3000); // Hide snackbar after 3 seconds

      // Show success message or redirect to a thank you page
      alert('Order placed successfully! Check your email for confirmation.');
    } catch (error) {
      console.error('Error processing order:', error.message);
      alert('There was an error processing your order. Please try again.');
    }
  };

  return (
    <section>
      <Header />
      <div className="container mx-auto px-6 md:px-36 py-12">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-8 font-domine">
          Checkout
        </h1>

        {/* Cart Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between items-center mb-2">
              <span>
                {item.name} (x{item.quantity})
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between items-center font-bold">
              <span>Total</span>
              <span>
                <span className="text-xl">${total.toFixed(2)}</span>
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto">
          {/* Billing Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Billing Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Full Name</label>
                <input
                  {...register('fullName')}
                  className="w-full p-2 border rounded"
                />
                {errors.fullName && (
                  <p className="text-red-500">{errors.fullName.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-2">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full p-2 border rounded"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="block mb-2">Address</label>
                <input
                  {...register('address')}
                  className="w-full p-2 border rounded"
                />
                {errors.address && (
                  <p className="text-red-500">{errors.address.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-2">City</label>
                <input
                  {...register('city')}
                  className="w-full p-2 border rounded"
                />
                {errors.city && (
                  <p className="text-red-500">{errors.city.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-2">Postal Code</label>
                <input
                  {...register('postalCode')}
                  className="w-full p-2 border rounded"
                />
                {errors.postalCode && (
                  <p className="text-red-500">{errors.postalCode.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-2">Country</label>
                <input
                  {...register('country')}
                  className="w-full p-2 border rounded"
                />
                {errors.country && (
                  <p className="text-red-500">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
            <div>
              <label className="inline-flex items-center mr-6">
                <input
                  type="radio"
                  {...register('paymentMethod')}
                  value="credit"
                  onChange={() => setPaymentMethod('credit')}
                  checked={watchPaymentMethod === 'credit'}
                  className="form-radio"
                />
                <span className="ml-2">Credit Card</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('paymentMethod')}
                  value="paypal"
                  onChange={() => setPaymentMethod('paypal')}
                  checked={watchPaymentMethod === 'paypal'}
                  className="form-radio"
                />
                <span className="ml-2">PayPal</span>
              </label>
            </div>
            {errors.paymentMethod && (
              <p className="text-red-500">{errors.paymentMethod.message}</p>
            )}

            {paymentMethod === 'credit' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block mb-2">Card Number</label>
                  <input
                    {...register('cardNumber')}
                    className="w-full p-2 border rounded"
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500">{errors.cardNumber.message}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2">Expiry Date</label>
                  <input
                    {...register('expiryDate')}
                    className="w-full p-2 border rounded"
                    placeholder="MM/YY"
                  />
                  {errors.expiryDate && (
                    <p className="text-red-500">{errors.expiryDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="block mb-2">CVV</label>
                  <input
                    {...register('cvv')}
                    className="w-full p-2 border rounded"
                  />
                  {errors.cvv && (
                    <p className="text-red-500">{errors.cvv.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Shipping Method */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Shipping Method</h2>
            <div>
              <label className="inline-flex items-center mr-6">
                <input
                  type="radio"
                  {...register('shippingMethod')}
                  value="standard"
                  className="form-radio"
                />
                <span className="ml-2">Standard</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('shippingMethod')}
                  value="express"
                  className="form-radio"
                />
                <span className="ml-2">Express</span>
              </label>
            </div>
            {errors.shippingMethod && (
              <p className="text-red-500">{errors.shippingMethod.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded ${
              loading ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>

        {/* Snackbar */}
        {showSnackbar && (
          <div className="fixed top-4 right-4 z-50 flex items-center bg-green-500 text-white px-4 py-2 rounded shadow-md">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            Ordered Successfully!
          </div>
        )}
      </div>
      <Footer />
    </section>
  );
};
