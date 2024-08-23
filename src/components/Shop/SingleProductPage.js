import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Footer } from '../footer';
import { Header } from '../header';
import Visa from '../../assets/Safecheckout.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export const SingleProductPage = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(product?.imageUrls?.[0]);
  const [loading, setLoading] = useState(false); // Loading state
  const [showSnackbar, setShowSnackbar] = useState(false); // Snackbar state

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(product);
      setShowSnackbar(true); // Show snackbar on success
      setTimeout(() => {
        setShowSnackbar(false);
        setLoading(false);
      }, 3000); // Hide snackbar after 3 seconds
    } catch (error) {
      setLoading(false);
      console.error('Failed to add to cart', error);
    }
  };

  return (
    <section>
      <Header />
      <div className="container mx-auto px-6 md:px-36 py-12">
        <div className="flex flex-col md:flex-row">
          {/* Left Column: Image Carousel */}
          <div className="md:w-1/2">
            <div className="relative">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-80 object-cover mb-4"
              />
              <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
                <button
                  className="bg-white p-2 rounded-full shadow-md"
                  onClick={() =>
                    setSelectedImage(
                      product.imageUrls[
                        (product.imageUrls.indexOf(selectedImage) -
                          1 +
                          product.imageUrls.length) %
                          product.imageUrls.length
                      ]
                    )
                  }
                >
                  {'<'}
                </button>
              </div>
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
                <button
                  className="bg-white p-2 rounded-full shadow-md"
                  onClick={() =>
                    setSelectedImage(
                      product.imageUrls[
                        (product.imageUrls.indexOf(selectedImage) + 1) %
                          product.imageUrls.length
                      ]
                    )
                  }
                >
                  {'>'}
                </button>
              </div>
            </div>
            <div className="flex space-x-2 mt-4">
              {product.imageUrls.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-20 h-20 object-cover cursor-pointer ${
                    selectedImage === img
                      ? 'border-2 border-primaryBtn'
                      : 'border'
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="md:w-1/2 md:ml-8">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-gray-800 mb-4">
              ₹{product.price.toLocaleString()}
            </p>
            <div className="flex items-center mb-4">
              <div className="text-yellow-500 text-lg mr-2">★★★★☆</div>
              <p className="text-gray-500">(1 customer review)</p>
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-4">
              {product.description}
            </p>
            <button
              onClick={handleAddToCart}
              className={`bg-primaryBtn text-white px-6 py-3 rounded-full w-full ${
                loading
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'hover:bg-primaryBtnDark'
              }`}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'ADD TO CART'}
            </button>
            <div className="mt-6">
              <p className="text-gray-500 mb-2">
                Category:{' '}
                {product.category ? product.category : 'Uncategorized'}
              </p>
              <div className="flex items-center">
                <img src={Visa} alt="Visa" className="w-full h-auto mr-2" />
              </div>
              <p className="text-gray-600 mt-4">GUARANTEED SAFE CHECKOUT</p>
            </div>
          </div>
        </div>
      </div>

      {/* Snackbar */}
      {showSnackbar && (
        <div className="fixed top-4 right-4 z-50 flex items-center bg-green-500 text-white px-4 py-2 rounded shadow-md">
          <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
          Product added to cart!
        </div>
      )}

      <Footer />
    </section>
  );
};
