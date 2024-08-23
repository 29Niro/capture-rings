import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [currentImage, setCurrentImage] = useState(product.imageUrls[0]); // Current image state

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await addToCart(product);
      setShowSnackbar(true);
      setTimeout(() => {
        setShowSnackbar(false);
        setLoading(false);
      }, 3000);
    } catch (error) {
      setLoading(false);
      console.error('Failed to add to cart', error);
    }
  };

  return (
    <div className="relative border p-4 rounded-lg shadow-md">
      <Link
        to={`/product/${product.id}`}
        state={{ product }}
        onMouseEnter={() =>
          product.imageUrls[1] && setCurrentImage(product.imageUrls[1])
        }
        onMouseLeave={() => setCurrentImage(product.imageUrls[0])}
      >
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-56 object-cover mb-2"
        />
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
      </Link>
      <button
        onClick={handleAddToCart}
        className={`mt-2 px-4 py-2 rounded text-white w-full ${
          loading
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
        disabled={loading}
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>

      {/* Snackbar */}
      {showSnackbar && (
        <div className="fixed top-4 right-4 z-50 flex items-center bg-green-500 text-white px-4 py-2 rounded shadow-md">
          <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
          Product added to cart!
        </div>
      )}
    </div>
  );
};
