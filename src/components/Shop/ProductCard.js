import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <Link to={`/product/${product.id}`} state={{ product }}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-56 object-cover mb-2"
        />
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
      </Link>
      <button
        onClick={() => addToCart(product)}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add to Cart
      </button>
    </div>
  );
};
