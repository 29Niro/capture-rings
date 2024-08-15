const generateBookingId = () => {
  return "BOOK-" + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const generateOrderId = () => {
  return "ORDER-" + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export { generateBookingId, generateOrderId };
