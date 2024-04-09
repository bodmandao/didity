import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getCustomerByEmail, getCustomerBookings } from '../../utils/booking';
import MyBookingsModal from './MyBookingsModal';
import { NotificationError, NotificationSuccess } from '../utils/Notifications';
import { toast } from "react-toastify";

/**
 * Component for displaying My Bookings page.
 * @returns {JSX.Element} JSX element representing the MyBookingsPage component.
 */
const MyBookingsPage = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showBookingsModal, setShowBookingsModal] = useState(false);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [bookings, setBookings] = useState([]);

  /**
   * Fetches bookings when bookings modal is shown and userId is set.
   */
  useEffect(() => {
    if (showBookingsModal && userId) {
      fetchBookings();
    }
  }, [showBookingsModal, userId]);

  /**
   * Fetches customer bookings.
   */
  const fetchBookings = async () => {
    try {
      const customerBookings = await getCustomerBookings(userId);
      setBookings(customerBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  /**
   * Handles email submission.
   * @param {Event} e - Form submission event.
   */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const customer = await getCustomerByEmail(email);
      if (customer.Ok) {
        setUserId(customer.Ok.id);
        setShowEmailModal(false);
        setShowBookingsModal(true);
      } else {
        toast(<NotificationError text={`Customer ID not found for email:', ${email}`} />);
        console.error('Customer ID not found for email:', email);
      }
    } catch (error) {
      toast(<NotificationError text="Error fetching customer ID" />);
      console.error('Error fetching customer ID:', error);
    }
  };

  return (
    <>
      <Button variant="primary" className='mt-2 mx-2' onClick={() => setShowEmailModal(true)}>
        Show My Bookings
      </Button>

      <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enter Your Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEmailSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Button className='mt-2' variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <MyBookingsModal
        show={showBookingsModal}
        handleClose={() => setShowBookingsModal(false)}
        bookings={bookings}
      />
    </>
  );
};

export default MyBookingsPage;