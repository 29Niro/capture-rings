import React from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Footer } from "../footer";
import { Header } from "../header";

export const SingleProductPage = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const { addToCart } = useCart();

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <section>
      <Header />
      <div className="container mx-auto px-6 md:px-36 py-12">
        <div className="flex flex-col md:flex-row">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full md:w-1/3 h-80 object-cover mb-4 md:mb-0"
          />
          <div className="md:ml-8">
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-gray-600 mb-4">${product.price.toFixed(2)}</p>
            <p className="mb-4">{product.description}</p>
            <button
              onClick={() => addToCart(product)}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};
