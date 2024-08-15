import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import { Header } from '../components/header';
import { Footer } from '../components/footer';

export const Gallery = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'events'));
        setEvents(
          querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/gallery/${id}`);
  };

  return (
    <section>
      <Header />
      <div className="container mx-auto px-6 md:px-36 py-12">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 font-domine">
          Image Gallery
        </h1>
        <p className="text-center text-gray-700 mb-12">
          Welcome to Capture Rings Studio’s Image Gallery! Here, you will find a
          stunning collection of photographs showcasing our passion for
          capturing precious moments and creating timeless memories. Take a
          virtual tour through our diverse portfolio that reflects the essence
          of our studio.
        </p>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <p>Loading...</p>
          </div>
        )}

        {/* No Data State */}
        {!loading && events.length === 0 && (
          <div className="text-center py-20">
            <h2>No blogs available</h2>
          </div>
        )}

        {/* event List */}
        {!loading && events.length > 0 && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="cursor-pointer border rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105"
              onClick={() => handleCardClick(event.id)}
            >
              <img
                src={event.imageUrls[0] || 'https://via.placeholder.com/150'} // Fallback if imageUrl is not present
                alt={event.eventName}
                className="w-full h-80 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold">{event.eventName}</h2>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
      <Footer />
    </section>
  );
};
