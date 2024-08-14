import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BlogManagement } from "./components/AdminDashboard/BlogManagement";
import { Bookings } from "./components/AdminDashboard/Bookings";
import { EventGalleryManagement } from "./components/AdminDashboard/EventGalleryManagement";
import { Layout } from "./components/AdminDashboard/Layout";
import { Packages } from "./components/AdminDashboard/Packages";
import { ProductManagement } from "./components/AdminDashboard/ProductManagement";
import { Teams } from "./components/AdminDashboard/Teams";
import { EventGallery } from "./components/EventGallery";
import { CartPage } from "./components/Shop/CartPage";
import { CheckoutPage } from "./components/Shop/CheckoutPage";
import { SingleProductPage } from "./components/Shop/SingleProductPage";
import { CartProvider } from "./context/CartContext";
import { AboutUs } from "./pages/AboutUs";
import { Blog } from "./pages/Blog";
import { Contactpage } from "./pages/Contactpage";
import { EventBooking } from "./pages/EventBooking";
import { Gallery } from "./pages/Gallery";
import { Homepage } from "./pages/Homepage";
import { ShopPage } from "./pages/ShopPage";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/contact" element={<Contactpage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/booking" element={<EventBooking />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/gallery/:id" element={<EventGallery />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<SingleProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<Layout />}>
            <Route path="teams" element={<Teams />} />
            <Route path="packages" element={<Packages />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="blog-management" element={<BlogManagement />} />
            <Route
              path="event-gallery-management"
              element={<EventGalleryManagement />}
            />
            <Route path="product-management" element={<ProductManagement />} />
            {/* Add more admin routes as needed */}
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
