import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { toast } from "react-toastify";
import RegistrationModal from './RegistrationModal';
// import Layout from '../components/Layout';
import { createAppointment } from '../../utils/booking';
import { NotificationError,NotificationSuccess } from '../utils/Notifications';

const AppointmentCreationPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);

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

  const handleRegisterClick = async () => {
    setShowRegisterModal(true);
  };

  return (
    // <Layout>
      <div className="container mt-4">
        <Button variant="info" className='btn btn-primary text-center' onClick={handleRegisterClick}>Click to Register</Button>
        {/* Register Modal */}
      <RegistrationModal show={showRegisterModal} handleClose={() => setShowRegisterModal(false)} />

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
