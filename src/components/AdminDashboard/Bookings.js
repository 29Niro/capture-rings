import { formatDistanceToNow } from "date-fns";
import {
  collection,
  doc,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { db } from "../../firebase/firebase-config";

Modal.setAppElement("#root");

export const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const BOOKINGS_PER_PAGE = 10;

  useEffect(() => {
    fetchTotalCount();
    fetchBookings(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTotalCount = async () => {
    const coll = collection(db, "appointments");
    const snapshot = await getCountFromServer(coll);
    const totalCount = snapshot.data().count;
    setTotalPages(Math.ceil(totalCount / BOOKINGS_PER_PAGE));
  };

  const fetchBookings = async (page) => {
    setLoading(true);
    let q = query(
      collection(db, "appointments"),
      orderBy("createdAt", "desc"),
      limit(BOOKINGS_PER_PAGE)
    );

    if (page > 1) {
      const lastVisible = await getLastVisibleDoc(page - 1);
      q = query(
        collection(db, "appointments"),
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(BOOKINGS_PER_PAGE)
      );
    }

    const snapshot = await getDocs(q);
    const bookingsData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setBookings(bookingsData);
    setCurrentPage(page);
    setLoading(false);
  };

  const getLastVisibleDoc = async (page) => {
    const q = query(
      collection(db, "appointments"),
      orderBy("createdAt", "desc"),
      limit(page * BOOKINGS_PER_PAGE)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs[snapshot.docs.length - 1];
  };

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  const markAsCompleted = async (id) => {
    const bookingDoc = doc(db, "appointments", id);
    await updateDoc(bookingDoc, { status: "completed" });
    fetchBookings(currentPage); // Refresh the current page
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => fetchBookings(i)}
          className={`mx-1 px-3 py-1 rounded ${
            currentPage === i ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-4">Booking Details</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2">Booking ID</th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Package</th>
              <th className="border px-4 py-2">Amount</th>
              <th className="border px-4 py-2">Booked</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="border px-4 py-2">{booking.id}</td>
                <td className="border px-4 py-2">
                  {booking.fname} {booking.lname}
                </td>
                <td className="border px-4 py-2">{booking.title}</td>
                <td className="border px-4 py-2">{booking.price}</td>
                <td className="border px-4 py-2">
                  {formatDistanceToNow(booking.createdAt.toDate())} ago
                </td>
                <td className="border px-4 py-2">{booking.status}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => openModal(booking)}
                    className="bg-blue-500 text-white px-4 py-1 mr-2 rounded"
                  >
                    View
                  </button>
                  {(booking.status === "pending" ||
                    booking.status === "seen") && (
                    <button
                      onClick={() => markAsCompleted(booking.id)}
                      className="bg-green-500 text-white px-4 py-1 rounded"
                    >
                      Complete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-center items-center">
        <button
          onClick={() => fetchBookings(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 mr-2"
        >
          Previous
        </button>
        {renderPagination()}
        <button
          onClick={() => fetchBookings(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400 ml-2"
        >
          Next
        </button>
      </div>

      {/* Modal for Viewing Booking Details */}
      {selectedBooking && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Booking Details"
          className="fixed inset-0 flex items-center justify-center p-4"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white p-8 max-w-md w-full rounded-lg shadow-lg">
            <h2 className="text-xl mb-4">Booking Details</h2>
            <div className="mb-4">
              <strong>Booking ID:</strong> {selectedBooking.id}
            </div>
            <div className="mb-4">
              <strong>Name:</strong> {selectedBooking.fname}{" "}
              {selectedBooking.lname}
            </div>
            <div className="mb-4">
              <strong>Email:</strong> {selectedBooking.email}
            </div>
            <div className="mb-4">
              <strong>Phone Number:</strong> {selectedBooking.phone}
            </div>
            <div className="mb-4">
              <strong>Date:</strong> {selectedBooking.date}
            </div>
            <div className="mb-4">
              <strong>Time:</strong> {selectedBooking.time}
            </div>
            <div className="mb-4">
              <strong>Package:</strong> {selectedBooking.title}
            </div>
            <div className="mb-4">
              <strong>Amount:</strong> {selectedBooking.price}
            </div>
            <div className="mb-4">
              <strong>Team:</strong> {selectedBooking.team || "N/A"}
            </div>
            <div className="mb-4">
              <strong>Duration:</strong> {selectedBooking.duration || "N/A"}{" "}
              hours
            </div>
            <div className="mb-4">
              <strong>Status:</strong> {selectedBooking.status}
            </div>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                type="button"
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
