import React from 'react';
import { Header } from '../components/header';
import { Footer } from '../components/footer';
import { ProductListing } from '../components/Shop/ProductListing';

const products = [
  {
    id: 1,
    name: 'Product 1',
    price: 100,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    name: 'Product 2',
    price: 200,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    name: 'Product 3',
    price: 150,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: 4,
    name: 'Product 4',
    price: 250,
    image: 'https://via.placeholder.com/150',
  },
];

export const Shop = () => {
  return (
    <div>
      <Header />
      <section>
        <ProductListing products={products} />
      </section>
      <Footer />
    </div>
  );
};
