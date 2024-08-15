import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../firebase/firebase-config"; // Adjust the import path as needed

export const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("submitting");
    try {
      await addDoc(collection(db, "contactSubmissions"), {
        name,
        email,
        message,
        createdAt: serverTimestamp(),
        status: "unread",
      });
      setSubmitStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting form: ", error);
      setSubmitStatus("error");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-4 border border-gray-300 rounded-lg"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            className="w-full p-4 border border-gray-300 rounded-lg"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg"
            rows="4"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600"
          disabled={submitStatus === "submitting"}
        >
          {submitStatus === "submitting" ? "Sending..." : "SUBMIT"}
        </button>
      </form>
      {submitStatus === "success" && (
        <p className="mt-4 text-green-600">
          Thank you for your message. We'll get back to you soon!
        </p>
      )}
      {submitStatus === "error" && (
        <p className="mt-4 text-red-600">
          There was an error submitting your message. Please try again.
        </p>
      )}
    </div>
  );
};
