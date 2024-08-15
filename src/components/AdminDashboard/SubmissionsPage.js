import { faEnvelope, faEnvelopeOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebase-config";

export const SubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchSubmissions = async () => {
    setLoading(true);
    const q = query(
      collection(db, "contactSubmissions"),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const submissionsArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setSubmissions(submissionsArray);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setHasMore(querySnapshot.docs.length === 10);
    setLoading(false);
  };

  const fetchMoreSubmissions = async () => {
    if (!lastVisible) return;

    setLoading(true);
    const q = query(
      collection(db, "contactSubmissions"),
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(10)
    );

    const querySnapshot = await getDocs(q);
    const newSubmissions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setSubmissions([...submissions, ...newSubmissions]);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    setHasMore(querySnapshot.docs.length === 10);
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const toggleReadStatus = async (id, currentStatus) => {
    const submissionRef = doc(db, "contactSubmissions", id);
    const newStatus = currentStatus === "read" ? "unread" : "read";
    await updateDoc(submissionRef, { status: newStatus });

    setSubmissions(
      submissions.map((sub) =>
        sub.id === id ? { ...sub, status: newStatus } : sub
      )
    );
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Contact Form Submissions</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Message</th>
              <th className="px-4 py-2 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id} className="border-b">
                <td className="px-4 py-2">
                  <button
                    onClick={() =>
                      toggleReadStatus(submission.id, submission.status)
                    }
                  >
                    <FontAwesomeIcon
                      icon={
                        submission.status === "read"
                          ? faEnvelopeOpen
                          : faEnvelope
                      }
                      className={
                        submission.status === "read"
                          ? "text-gray-400"
                          : "text-blue-500"
                      }
                    />
                  </button>
                </td>
                <td className="px-4 py-2">{submission.name}</td>
                <td className="px-4 py-2">{submission.email}</td>
                <td className="px-4 py-2">
                  {submission.message.substring(0, 50)}...
                </td>
                <td className="px-4 py-2">
                  {submission.createdAt?.toDate().toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={fetchMoreSubmissions}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};
