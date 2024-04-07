
import React,{ useEffect, useState } from 'react';
import { getCustomerBookings, cancelBooking } from '../../utils/booking';
import BookingCard from './AppoinmentCard';

const MyBookingsPage = ({ customerId }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (customerId) {
      fetchBookings(customerId);
    }
  }, [customerId]);

  const fetchBookings = async (customerId) => {
    try {
      const customerBookings = await getCustomerBookings(customerId);
      setBookings(customerBookings);
    } catch (error) {
      console.error('Error fetching customer bookings:', error);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      // Refresh bookings after cancellation
      fetchBookings(customerId);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">My Bookings</h2>
      <div className="row">
        {bookings.map((booking) => (
          <div key={booking.id} className="col-lg-4 col-md-6 mb-4">
            <BookingCard
              booking={booking}
              onCancelBooking={handleCancelBooking}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookingsPage;
