import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from "react-toastify";
import RegistrationModal from './RegistrationModal';
// import Layout from '../components/Layout';
import { createAppointment } from '../../utils/booking';
import { NotificationError,NotificationSuccess } from '../utils/Notifications';
import MyBookingsModal from './MyBookingsModal';
import MyBookingsPage from './MyBookingsPage';

/**
 * Component for appointment creation page.
 * @returns {JSX.Element} JSX element representing the appointment creation page.
 */
const AppointmentCreationPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showMyBookingsModal, setShowMyBookingsModal] = useState(false); // State for showing My Bookings modal

  /**
   * Handles form submission to create an appointment.
   * @param {Event} e - Form submit event.
   * @returns {void}
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const create = await createAppointment(title, description, BigInt(date), BigInt(duration));
        create.Ok? toast(<NotificationSuccess text="Appointment created successfully." />) :  toast(<NotificationError text="Failed to create an appointment." />);
      
    } catch (error) {
      console.log(error)
      toast(<NotificationError text="Failed to create an appointment." />);
    }
    // Optionally, redirect to another page after appointment creation
  };

  /**
   * Handles click event to open registration modal.
   * @returns {void}
   */
  const handleRegisterClick = async () => {
    setShowRegisterModal(true);
  };

  /**
   * Handles click event to open My Bookings modal.
   * @returns {void}
   */
  const handleMyBookingsClick = () => {
    setShowMyBookingsModal(true);
  };

  return (
    // <Layout>
      <div className="container mt-4">
        <Button variant="info" className='btn btn-primary text-center mt-2' onClick={handleRegisterClick}>Click to Register</Button>
        <Button variant="primary" className="mt-2 mx-2" onClick={handleMyBookingsClick}>
        My Bookings
      </Button>
        {/* Register Modal */}
      <RegistrationModal show={showRegisterModal} handleClose={() => setShowRegisterModal(false)} />
      {showMyBookingsModal && <MyBookingsPage />}

        <h1 className='mt-5 text-primary fw-bold text-left'>Create Appointment</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="minutes"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formDuration">
            <Form.Label>Duration (in minutes)</Form.Label>
            <Form.Control
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </Form.Group>
          <Button className='mt-2' variant="primary" type="submit">
            Create Appointment
          </Button>
        </Form>
      </div>
    // </Layout>
  );
};

export default AppointmentCreationPage;