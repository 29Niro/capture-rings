import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase/firebase-config";
import { Footer } from "./footer";
import { Header } from "./header";

export const EventGallery = () => {
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        // Fetch event title from Firestore
        const eventDoc = await getDoc(doc(db, "events", id));
        if (eventDoc.exists()) {
          setEventTitle(eventDoc.data().eventName);
        }

        // // Fetch event images from Firebase Storage
        // const storageRef = ref(storage, `events/${id}`);
        // const imageRefs = await listAll(storageRef);

        // const urls = await Promise.all(
        //   imageRefs.items.map((imageRef) => getDownloadURL(imageRef))
        // );

        setImages(eventDoc.data().imageUrls);
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  return (
    <section>
      <Header />
      <div className="container mx-auto px-6 md:px-36 py-12">
        <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 font-domine">
          {eventTitle || "Event Gallery"}
        </h1>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <p>Loading...</p>
          </div>
        )}

        {/* No Data State */}
        {!loading && images.length === 0 && (
          <div className="text-center py-20">
            <h2>No blogs available</h2>
          </div>
        )}

        {/* Image Gallery */}
        {!loading && images.length > 0 && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-6">
            {images.map((url, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden shadow-lg"
              >
                <img
                  src={url}
                  alt={`${index + 1}`}
                  className="w-full h-80 object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </section>
  );
};
