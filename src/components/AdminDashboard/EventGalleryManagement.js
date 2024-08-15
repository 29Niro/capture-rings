// src/components/EventGalleryManagement.js
import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '../../firebase/firebase-config';

export const EventGalleryManagement = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);

  // Fetch events from Firestore
  const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, 'events'));
    setEvents(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEditEvent = async (data) => {
    if (editEvent) {
      await updateDoc(doc(db, 'events', editEvent.id), {
        ...data,
        updatedAt: serverTimestamp(),
      });
    } else {
      await addDoc(collection(db, 'events'), {
        ...data,
        createdAt: serverTimestamp(),
      });
    }
    setIsModalOpen(false);
    setEditEvent(null);
    await fetchEvents(); // Reload events to reflect the new changes
  };

  const handleDeleteEvent = async (id) => {
    const eventRef = doc(db, 'events', id);
    const event = (await getDoc(eventRef)).data();

    // Delete images from storage
    const imagePromises = event.imageUrls.map((url) => {
      const imageRef = ref(storage, url);
      return deleteObject(imageRef);
    });
    await Promise.all(imagePromises);

    await deleteDoc(eventRef);
    setEvents(events.filter((event) => event.id !== id));
  };

  const openModal = (event = null) => {
    setEditEvent(event);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Events</h2>
      <button
        className="bg-primaryBtn text-white px-4 py-2 rounded-lg mb-4"
        onClick={() => openModal()}
      >
        Add New Event
      </button>
      <table className="table-auto w-full bg-white shadow-md">
        <thead>
          <tr>
            <th className="border px-4 py-2">Event Name</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td className="border px-4 py-2">{event.eventName}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded-lg mr-2"
                  onClick={() => openModal(event)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded-lg"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddEditEvent}
          event={editEvent}
        />
      )}
    </div>
  );
};

const EventModal = ({ isOpen, onClose, onSave, event }) => {
  const [eventName, setEventName] = useState(event?.eventName || '');
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState(event?.imageUrls || []);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async () => {
    const uploadPromises = imageFiles.map((file) => {
      const storageRef = ref(storage, `eventImages/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed', null, reject, async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        });
      });
    });

    return Promise.all(uploadPromises);
  };

  const handleRemoveImage = async (url) => {
    try {
      const imageRef = ref(storage, url);
      await deleteObject(imageRef);

      // Remove URL from state
      setImageUrls(imageUrls.filter((imageUrl) => imageUrl !== url));
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const uploadedUrls = await handleImageUpload();
      const eventData = {
        eventName,
        imageUrls: [...imageUrls, ...uploadedUrls],
      };

      await onSave(eventData);
      setUploading(false);
      onClose(); // Close the modal after save
    } catch (error) {
      console.error('Error saving event:', error);
      setUploading(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-xl mb-4">
            {event ? 'Edit Event' : 'Add New Event'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Event Name</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="border p-2 w-full"
                disabled={uploading}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Upload Images</label>
              <input
                type="file"
                multiple
                onChange={(e) => setImageFiles(Array.from(e.target.files))}
                className="border p-2 w-full"
                disabled={uploading}
              />
            </div>
            {imageUrls.length > 0 && (
              <div className="mb-4">
                <label className="block text-gray-700">Existing Images</label>
                <div className="flex flex-wrap gap-2">
                  {imageUrls.map((url) => (
                    <div key={url} className="relative">
                      <img
                        src={url}
                        alt="Event"
                        className="w-20 h-20 object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                        onClick={() => handleRemoveImage(url)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {uploading && (
              <p className="text-gray-500 mt-2">Uploading images...</p>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-300 text-black px-4 py-2 mr-2"
                onClick={onClose}
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded-lg ${
                  uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
                }`}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : event ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};
